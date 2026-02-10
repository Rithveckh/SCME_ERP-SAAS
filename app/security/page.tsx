"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Security(){

  const [visitors,setVisitors]=useState<any[]>([])

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    const { data,error } = await supabase
      .from("visitors")
      .select("*")
      .eq("status","approved")
      .order("created_at",{ascending:false})

    if(error) console.log(error)

    setVisitors(data || [])
  }

  const markEntry = async(id:string)=>{
    await supabase.from("visitors")
      .update({
        status:"inside",
        entry_time:new Date()
      })
      .eq("id",id)

    load()
  }

  const markExit = async(id:string)=>{
    await supabase.from("visitors")
      .update({
        status:"exited",
        exit_time:new Date()
      })
      .eq("id",id)

    load()
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6 text-white">
        🛡 Security Gate Panel
      </h1>

      {visitors.length===0 && (
        <p className="text-gray-400">No approved visitors</p>
      )}

      {visitors.map(v=>(
        <div key={v.id} className="border p-4 mb-3 rounded bg-white shadow">

          <p className="font-bold text-lg">{v.visitor_name}</p>
          <p>📞 {v.phone}</p>
          <p>🎯 {v.purpose}</p>
          <p>Status: {v.status}</p>

          <div className="flex gap-3 mt-3">

            <button
              onClick={()=>markEntry(v.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Entry
            </button>

            <button
              onClick={()=>markExit(v.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Exit
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}
