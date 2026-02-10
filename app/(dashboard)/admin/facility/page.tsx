"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AdminFacility(){

  const [bookings,setBookings]=useState<any[]>([])

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{
    const { data } = await supabase
      .from("facility_bookings")
      .select("*")
      .order("created_at",{ascending:false})

    setBookings(data||[])
  }

  const approve = async(id:string)=>{
    await supabase.from("facility_bookings")
      .update({status:"approved"})
      .eq("id",id)
    load()
  }

  const reject = async(id:string)=>{
    await supabase.from("facility_bookings")
      .update({status:"rejected"})
      .eq("id",id)
    load()
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        🏢 Facility Booking Requests
      </h1>

      {bookings.map(b=>(
        <div key={b.id} className="bg-white p-4 mb-3 rounded">

          <p><b>{b.facility_name}</b></p>
          <p>{b.booking_date}</p>
          <p>{b.start_time}-{b.end_time}</p>
          <p>Status: {b.status}</p>

          {b.status==="pending" && (
            <div className="flex gap-3 mt-2">
              <button
                onClick={()=>approve(b.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={()=>reject(b.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}

        </div>
      ))}

    </div>
  )
}
