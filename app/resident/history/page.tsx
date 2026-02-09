"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"

export default function ComplaintHistory(){

  const { user } = useUser()
  const [data,setData]=useState<any[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData) return

      const { data:complaints } = await supabase
        .from("complaints")
        .select("*")
        .eq("resident_id", userData.id)
        .order("created_at",{ascending:false})

      setData(complaints || [])
      setLoading(false)
    }

    load()
  },[user])

  if(loading){
    return <div className="p-10">Loading...</div>
  }

  return(
    <div className="p-10 bg-gray-100 min-h-screen text-gray-900">

      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Complaint History</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {data.length===0 && (
        <div className="bg-white p-6 rounded shadow">
          No complaints raised yet.
        </div>
      )}

      {data.map(c=>(
        <div key={c.id} className="bg-white p-6 rounded-xl shadow mb-4">

          <p className="text-lg font-bold">{c.category}</p>
          <p className="text-gray-600">{c.description}</p>

          {/* STATUS */}
          <p className="mt-3">
            <b>Status:</b>{" "}
            <span className={`px-3 py-1 rounded-full text-sm font-bold
              ${
                c.status==="completed"
                ? "bg-green-600 text-white"
                : c.status==="in-progress"
                ? "bg-yellow-500 text-white"
                : "bg-red-600 text-white"
              }
            `}>
              {c.status}
            </span>
          </p>

        </div>
      ))}

    </div>
  )
}
