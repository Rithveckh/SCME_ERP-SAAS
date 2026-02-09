"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function Vendors(){

  const { user } = useUser()
  const [vendors,setVendors]=useState<any[]>([])
  const [tenant,setTenant]=useState("")

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id",user.id)
        .single()

      if(!userData) return
      setTenant(userData.tenant_id)

      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("tenant_id",userData.tenant_id)

      setVendors(data||[])
    }

    load()
  },[user])

  const hireVendor = async(vendorId:string)=>{
    const work = prompt("Enter work description")
    if(!work) return

    await supabase.from("vendor_jobs").insert([{
      vendor_id:vendorId,
      work,
      status:"pending",
      tenant_id:tenant
    }])

    alert("Vendor hired successfully")
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6">🏭 Vendor Marketplace</h1>

      {vendors.map(v=>(
        <div key={v.id} className="bg-white p-6 rounded shadow mb-4">

          <p className="text-xl font-bold">{v.name}</p>
          <p>Service: {v.service}</p>
          <p>Phone: {v.phone}</p>
          <p className="text-green-600 font-bold">₹ {v.price}</p>

          <button
            onClick={()=>hireVendor(v.id)}
            className="mt-3 bg-black text-white px-4 py-2 rounded"
          >
            Hire Vendor
          </button>

        </div>
      ))}

    </div>
  )
}
