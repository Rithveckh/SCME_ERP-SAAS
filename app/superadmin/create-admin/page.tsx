"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function CreateAdmin(){

  const [tenants,setTenants]=useState<any[]>([])
  const [email,setEmail]=useState("")
  const [name,setName]=useState("")
  const [tenant,setTenant]=useState("")

  useEffect(()=>{
    loadTenants()
  },[])

  const loadTenants = async()=>{
    const { data } = await supabase.from("tenants").select("*")
    setTenants(data||[])
  }

  const createAdmin = async()=>{

    if(!email || !tenant || !name){
      alert("Fill all fields")
      return
    }

    await supabase.from("users").insert([{
      email,
      name,
      role:"admin",
      tenant_id:tenant
    }])

    alert("Admin created. Tell admin to login with this email.")
    setEmail("")
    setName("")
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl text-white font-bold mb-6">👑 Create Apartment Admin</h1>

      <div className="bg-white p-6 rounded shadow max-w-md">

        <input
          placeholder="Admin name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          placeholder="Admin email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <select
          value={tenant}
          onChange={(e)=>setTenant(e.target.value)}
          className="border p-2 w-full mb-3"
        >
          <option value="">Select Apartment</option>
          {tenants.map(t=>(
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <button
          onClick={createAdmin}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Create Admin
        </button>

      </div>

    </div>
  )
}
