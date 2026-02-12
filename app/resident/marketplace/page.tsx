"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function Marketplace(){

  const { user } = useUser()
  const [services,setServices] = useState<any[]>([])

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      // 🔵 get logged resident
      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData) return

      // 🟢 FETCH vendor services for same tenant
      const { data } = await supabase
        .from("vendor_services")
        .select(`
          *,
          users!vendor_services_vendor_id_fkey(name)
        `)
        .eq("tenant_id", userData.tenant_id)
        .order("created_at",{ascending:false})

      console.log("Marketplace services:",data)

      setServices(data || [])
    }

    load()
  },[user])


  // 🛒 PLACE ORDER
const bookService = async(service:any)=>{
  if(!user) return alert("Login required")

  // get resident info
  const { data:resident } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single()

  if(!resident) return alert("Resident not found")

  // insert order
  await supabase.from("vendor_orders").insert([{
    tenant_id: resident.tenant_id,
    resident_id: resident.id,
    vendor_id: service.vendor_id,
    service: service.service_name,
    price: service.price,
    status:"pending"
  }])

  alert("✅ Service booked successfully")
}



  return(
    <div className="p-8 text-gray-900">

      <h1 className="text-3xl font-bold mb-8 text-white">🛒 Community Marketplace</h1>

      {services.length===0 && (
        <p className="text-gray-500">No services available yet</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">

        {services.map(s=>(
          <div key={s.id} className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-xl font-bold">{s.service_name}</h2>

            <p className="text-gray-500 mt-1">
              Vendor: {s.users?.name}
            </p>

            <button
              onClick={()=>bookService(s)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Book Service
            </button>

          </div>
        ))}

      </div>
    </div>
  )
}
