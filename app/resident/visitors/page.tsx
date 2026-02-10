"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function ResidentVisitors(){

  const { user } = useUser()

  const [name,setName]=useState("")
  const [phone,setPhone]=useState("")
  const [purpose,setPurpose]=useState("")
  const [visitors,setVisitors]=useState<any[]>([])
  const [tenant,setTenant]=useState("")

  useEffect(()=>{
    if(user) load()
  },[user])

  const load = async()=>{
    if(!user) return

    // get current user from db
    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user.id)
      .single()

    if(!userData) return

    setTenant(userData.tenant_id)

    // load visitors
    const { data } = await supabase
      .from("visitors")
      .select("*")
      .eq("resident_id",userData.id)
      .order("created_at",{ascending:false})

    setVisitors(data || [])
  }

  const addVisitor = async()=>{

    if(!name || !phone){
      alert("Enter name & phone")
      return
    }

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user?.id)
      .single()

    if(!userData){
      alert("User not found")
      return
    }

    const { error } = await supabase
      .from("visitors")
      .insert([{
        tenant_id: userData.tenant_id,
        resident_id: userData.id,
        visitor_name: name,
        phone: phone,
        purpose: purpose,
        status: "approved"   // 🔥 important
      }])

    if(error){
      console.log(error)
      alert("Error saving visitor")
    }else{
      alert("Visitor added successfully")
      setName("")
      setPhone("")
      setPurpose("")
      load()
    }
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6 text-white">
        🧾 Visitor Entry
      </h1>

      {/* form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 max-w-md">

        <input
          placeholder="Visitor name"
          className="border p-2 w-full mb-3"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <input
          placeholder="Phone"
          className="border p-2 w-full mb-3"
          value={phone}
          onChange={e=>setPhone(e.target.value)}
        />

        <input
          placeholder="Purpose"
          className="border p-2 w-full mb-3"
          value={purpose}
          onChange={e=>setPurpose(e.target.value)}
        />

        <button
          onClick={addVisitor}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Add Visitor
        </button>
      </div>

      {/* history */}
      <h2 className="text-xl font-bold mb-3 text-white">
        Recent Visitors
      </h2>

      {visitors.length===0 && (
        <p className="text-gray-400">No visitors added yet</p>
      )}

      {visitors.map(v=>(
        <div key={v.id} className="border p-3 mb-2 rounded bg-white shadow">
          <p className="font-bold">{v.visitor_name}</p>
          <p>📞 {v.phone}</p>
          <p>🎯 {v.purpose}</p>
          <p>Status: {v.status}</p>
        </div>
      ))}

    </div>
  )
}
