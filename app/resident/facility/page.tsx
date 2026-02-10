"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function FacilityBooking(){

  const { user } = useUser()

  const [facility,setFacility]=useState("Gym")
  const [date,setDate]=useState("")
  const [start,setStart]=useState("")
  const [end,setEnd]=useState("")
  const [bookings,setBookings]=useState<any[]>([])

  useEffect(()=>{
    if(user) load()
  },[user])

  const load = async()=>{
    if(!user) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user.id)
      .single()

    if(!userData) return

    const { data } = await supabase
      .from("facility_bookings")
      .select("*")
      .eq("resident_id",userData.id)
      .order("created_at",{ascending:false})

    setBookings(data||[])
  }

  const book = async()=>{

    if(!date || !start || !end){
      alert("Fill all fields")
      return
    }

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user?.id)
      .single()

    if(!userData) return

    // check double booking
    const { data:existing } = await supabase
      .from("facility_bookings")
      .select("*")
      .eq("facility_name",facility)
      .eq("booking_date",date)
      .eq("status","approved")

    if(existing && existing.length>0){
      alert("Slot already booked")
      return
    }

    await supabase.from("facility_bookings").insert([{
      tenant_id:userData.tenant_id,
      resident_id:userData.id,
      facility_name:facility,
      booking_date:date,
      start_time:start,
      end_time:end,
      status:"pending"
    }])

    alert("Booking request sent")
    load()
  }

  return(
    <div className="p-10 text-white">

      <h1 className="text-3xl font-bold mb-6">🏢 Facility Booking</h1>

      <div className="bg-white text-black p-6 rounded-xl max-w-md">

        <select
          className="border p-2 w-full mb-3"
          value={facility}
          onChange={e=>setFacility(e.target.value)}
        >
          <option>Gym</option>
          <option>Party Hall</option>
          <option>Swimming Pool</option>
          <option>Badminton Court</option>
        </select>

        <input type="date"
          className="border p-2 w-full mb-3"
          onChange={e=>setDate(e.target.value)}
        />

        <input placeholder="Start time"
          className="border p-2 w-full mb-3"
          onChange={e=>setStart(e.target.value)}
        />

        <input placeholder="End time"
          className="border p-2 w-full mb-3"
          onChange={e=>setEnd(e.target.value)}
        />

        <button
          onClick={book}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Book Facility
        </button>

      </div>

      {/* history */}
      <h2 className="text-xl mt-10 mb-3">My Bookings</h2>

      {bookings.map(b=>(
        <div key={b.id} className="bg-white text-black p-3 mb-2 rounded">
          <p><b>{b.facility_name}</b></p>
          <p>{b.booking_date} {b.start_time}-{b.end_time}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}

    </div>
  )
}
