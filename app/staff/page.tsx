// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"

// export default function StaffDashboard(){
//   const { user } = useUser()
//   const [tasks,setTasks]=useState<any[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load=async()=>{
//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       if(!userData) return

//       const { data } = await supabase
//         .from("complaints")
//         .select("*")
//         .eq("assigned_staff", userData.id)

//       setTasks(data || [])
//     }

//     load()
//   },[user])

//   return(
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-6">Staff Tasks</h1>

//       {tasks.map(t=>(
//         <div key={t.id} className="border p-4 mb-3">
//           <p>{t.category}</p>
//           <p>{t.description}</p>
//           <p>Status: {t.status}</p>
//         </div>
//       ))}
//     </div>
//   )
// }



// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser, UserButton } from "@clerk/nextjs"

// export default function StaffDashboard(){

//   const { user } = useUser()
//   const [tasks,setTasks]=useState<any[]>([])
//   const [items,setItems]=useState<any[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load=async()=>{
//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       const { data:taskData } = await supabase
//         .from("complaints")
//         .select("*")
//         .eq("assigned_staff", userData.id)

//       setTasks(taskData || [])

//       const { data:itemData } = await supabase
//         .from("inventory")
//         .select("*")
//         .eq("tenant_id", userData.tenant_id)

//       setItems(itemData || [])
//     }

//     load()
//   },[user])

//   const useItem = async(item:any)=>{
//     const qty = prompt("Enter quantity used")
//     if(!qty) return

//     const newQty = item.quantity - Number(qty)
//     if(newQty < 0) return alert("Not enough stock")

//     const { data:userData } = await supabase
//       .from("users")
//       .select("*")
//       .eq("clerk_id", user?.id)
//       .single()

//     // update stock
//     await supabase
//       .from("inventory")
//       .update({quantity:newQty})
//       .eq("id",item.id)

//     // log usage
//     await supabase.from("usage_logs").insert([{
//       tenant_id:userData.tenant_id,
//       staff_id:userData.id,
//       item_id:item.id,
//       quantity_used:Number(qty)
//     }])

//     alert("Stock updated")
//     location.reload()
//   }

//   return(
//     <div className="p-10">

//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-bold">Staff Dashboard</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       <h2 className="font-bold mb-3">Assigned Tasks</h2>
//       {tasks.map(t=>(
//         <div key={t.id} className="border p-3 mb-3">
//           {t.category} — {t.description}
//         </div>
//       ))}

//       <h2 className="font-bold mt-8 mb-3">Use Materials</h2>

//       {items.map(i=>(
//         <div key={i.id} className="border p-3 mb-2">
//           {i.item_name} — Qty: {i.quantity}

//           <button
//             onClick={()=>useItem(i)}
//             className="bg-red-600 text-white px-3 py-1 ml-4"
//           >
//             Use
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }


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

  return(
    <div className="min-h-screen bg-gray-100">

      {/* header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛠 Staff Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        {/* welcome */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold">
            Welcome {user?.fullName}
          </h2>
          <p className="opacity-90">Assigned Maintenance Tasks</p>
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
