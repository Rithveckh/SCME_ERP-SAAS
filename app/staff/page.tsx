"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"

export default function StaffDashboard(){

  const { user } = useUser()

  const [tasks,setTasks]=useState<any[]>([])
  const [items,setItems]=useState<any[]>([])
  const [stats,setStats]=useState({
    total:0,
    pending:0,
    completed:0
  })

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData) return

      // assigned tasks
      const { data:taskData } = await supabase
        .from("complaints")
        .select("*")
        .eq("assigned_staff", userData.id)
        .order("created_at",{ascending:false})

      setTasks(taskData || [])

      const total = taskData?.length || 0
      const completed = taskData?.filter(t=>t.status==="completed").length || 0
      const pending = total - completed

      setStats({
        total,
        pending,
        completed
      })

      // inventory
      const { data:itemData } = await supabase
        .from("inventory")
        .select("*")
        .eq("tenant_id", userData.tenant_id)

      setItems(itemData || [])
    }

    load()
  },[user])

  // use material
  const useItem = async(item:any)=>{
    const qty = prompt("Enter quantity used")
    if(!qty) return

    const newQty = item.quantity - Number(qty)
    if(newQty < 0) return alert("Not enough stock")

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user?.id)
      .single()

    await supabase
      .from("inventory")
      .update({quantity:newQty})
      .eq("id",item.id)

    await supabase.from("usage_logs").insert([{
      tenant_id:userData.tenant_id,
      staff_id:userData.id,
      item_id:item.id,
      quantity_used:Number(qty)
    }])

    alert("Material used & stock updated")
    location.reload()
  }

  const updateStatus = async(id:string,status:string)=>{
  await supabase
    .from("complaints")
    .update({status})
    .eq("id",id)

  alert("Updated")
  location.reload()
}

const checkIn = async()=>{
  if(!user) return

  const { data:userData } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single()

  if(!userData) return alert("User not found")

  // prevent double check-in
  const today = new Date().toISOString().split("T")[0]

  const { data:existing } = await supabase
    .from("staff_attendance")
    .select("*")
    .eq("staff_id",userData.id)
    .eq("date",today)
    .single()

  if(existing){
    alert("Already checked in today")
    return
  }

  await supabase.from("staff_attendance").insert([{
    tenant_id:userData.tenant_id,
    staff_id:userData.id,
    date:today,
    check_in:new Date(),
    status:"present"
  }])

  alert("✅ Checked in successfully")
}


const checkOut = async()=>{
  if(!user) return

  const { data:userData } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single()

  if(!userData) return

  const today = new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("staff_attendance")
    .select("*")
    .eq("staff_id",userData.id)
    .eq("date",today)
    .single()

  if(!data){
    alert("You didn't check in today")
    return
  }

  if(data.check_out){
    alert("Already checked out")
    return
  }

  await supabase
    .from("staff_attendance")
    .update({
      check_out:new Date()
    })
    .eq("id",data.id)

  alert("👋 Checked out successfully")
}


  return(
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛠 Staff Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        {/* welcome */}
        <div className="bg-linear-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold">
            Welcome {user?.fullName}
          </h2>
          <p className="opacity-90">Assigned Maintenance Tasks</p>
        </div>

      {/* attendance buttons */}
      <div className="flex gap-4 mb-8">

        <button
          onClick={checkIn}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow"
        >
          🟢 Check In
        </button>

        <button
          onClick={checkOut}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow"
        >
          🔴 Check Out
        </button>

      </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>

        </div>

        {/* assigned tasks */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-bold mb-4">📋 Assigned Tasks</h2>

          {tasks.length===0 && <p>No tasks assigned</p>}

          {tasks.map(t=>(
            <div key={t.id} className="border-b py-3">

              <p className="font-bold">{t.category}</p>
              <p className="text-gray-600">{t.description}</p>
              <p>Status: <b>{t.status}</b></p>

<div className="flex gap-3 mt-2">

  {t.status==="pending" && (
    <button
      onClick={()=>updateStatus(t.id,"in_progress")}
      className="bg-blue-600 text-white px-3 py-1 rounded"
    >
      Start Work
    </button>
  )}

  {t.status!=="completed" && (
    <button
      onClick={()=>updateStatus(t.id,"completed")}
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Mark Completed
    </button>
  )}

</div>


            </div>
          ))}
        </div>

        {/* inventory usage */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">🧰 Use Materials</h2>

          {items.map(i=>(
            <div key={i.id} className="flex justify-between border-b py-3">

              <div>
                <p className="font-bold">{i.item_name}</p>
                <p className="text-gray-500">Stock: {i.quantity}</p>
              </div>

              <button
                onClick={()=>useItem(i)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Use
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
