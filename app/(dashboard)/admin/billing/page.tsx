"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"

export default function AdminBilling(){
  const { user } = useUser()
  const [residents,setResidents]=useState<any[]>([])
  const [amount,setAmount]=useState("")

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("tenant_id", userData.tenant_id)
        .eq("role","resident")

      setResidents(data || [])
    }

    load()
  },[user])

  const generateBills = async()=>{
    if(!amount) return alert("Enter amount")

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user?.id)
      .single()

    for(const r of residents){
      await supabase.from("bills").insert([{
        tenant_id:userData.tenant_id,
        resident_id:r.id,
        amount:parseFloat(amount),
        month:new Date().toLocaleString("default",{month:"long"})
      }])
    }

    alert("Bills generated for all residents")
  }

  return(
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Billing System</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <input
        placeholder="Monthly maintenance amount"
        className="border p-2 mr-3"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
      />

      <button
        onClick={generateBills}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Monthly Bills
      </button>
    </div>
  )
}
