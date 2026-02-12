"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function VendorOrders(){

  const { user } = useUser()
  const [orders,setOrders] = useState<any[]>([])

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      // get vendor user
      const { data:vendor } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!vendor) return

      // fetch orders for this vendor
const { data } = await supabase
  .from("vendor_orders")
  .select(`
    *,
    resident:users!vendor_orders_resident_id_fkey(name)
  `)
  .eq("vendor_id", vendor.id)
  .order("created_at",{ascending:false})

console.log("orders with resident",data)


      setOrders(data || [])
    }

    load()
  },[user])

  return(
    <div className="p-8 text-gray-900">

      <h1 className="text-3xl font-bold mb-6 text-white">📦 My Orders</h1>

      {orders.length===0 && <p className="text-white">No orders yet</p>}

      {orders.map(o=>(
        <div key={o.id} className="bg-white p-6 shadow rounded-xl mb-4">

          <p className="font-bold text-lg">{o.service}</p>
          <p>Resident: <b>{o.resident?.name || "Unknown"}</b></p>
          <p>Price: ₹{o.price}</p>
          <p>Status: <b>{o.status}</b></p>

          {o.status==="pending" && (
            <button
              onClick={async()=>{
                await supabase
                  .from("vendor_orders")
                  .update({status:"completed"})
                  .eq("id",o.id)

                location.reload()
              }}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              Mark Completed
            </button>
          )}

        </div>
      ))}
    </div>
  )
}
