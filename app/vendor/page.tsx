"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function VendorDashboard(){

  const { user } = useUser()
  const [vendor,setVendor] = useState<any>(null)
  const [services,setServices] = useState<any[]>([])

  const [name,setName] = useState("")
  const [price,setPrice] = useState("")
  const [desc,setDesc] = useState("")

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      // get vendor from users table
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!data) return
      setVendor(data)

      // fetch vendor services
      const { data:servicesData } = await supabase
        .from("vendor_services")
        .select("*")
        .eq("vendor_id", data.id)
        .order("created_at",{ascending:false})

      setServices(servicesData || [])
    }

    load()
  },[user])

  // add service
  const addService = async()=>{

    if(!name || !price) return alert("Enter service + price")

    await supabase.from("vendor_services").insert([{
      tenant_id: vendor.tenant_id,
      vendor_id: vendor.id,
      service_name: name,
      price: Number(price),
      description: desc
    }])

    alert("Service added")
    location.reload()
  }

  return(
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* top bar */}
      <div className="bg-black text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">🛒 Vendor Panel</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

        {/* orders button */}
        <div className="mt-8 ml-8">
          <Link
            href="/vendor/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            📦 View Orders
          </Link>
        </div>


      <div className="p-8">
        {/* add service card */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-bold mb-4">➕ Add New Service</h2>

          <input
            placeholder="Service name (Milk, Repair...)"
            className="border p-2 w-full mb-3"
            onChange={e=>setName(e.target.value)}
          />

          <input
            placeholder="Price"
            className="border p-2 w-full mb-3"
            onChange={e=>setPrice(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="border p-2 w-full mb-3"
            onChange={e=>setDesc(e.target.value)}
          />
          <button
            onClick={addService}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Add Service
          </button>
        </div>

        {/* service list */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">📦 My Services</h2>

          {services.length===0 && <p>No services added</p>}

          {services.map(s=>(
            <div key={s.id} className="border-b py-3 flex justify-between">

              <div>
                <p className="font-bold">{s.service_name}</p>
                <p className="text-gray-500">₹ {s.price}</p>
                <p className="text-sm text-gray-400">{s.description}</p>
              </div>

              <button
                onClick={async()=>{
                  await supabase
                    .from("vendor_services")
                    .delete()
                    .eq("id",s.id)

                  location.reload()
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
