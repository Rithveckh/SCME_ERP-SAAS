"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function AICenter(){

  const { user } = useUser()
  const [tenant,setTenant]=useState("")
  const [actions,setActions]=useState<any[]>([])

  useEffect(()=>{
    if(!user) return
    load()
  },[user])

  const load = async()=>{

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user?.id)
      .single()

    if(!userData?.tenant_id) return
    setTenant(userData.tenant_id)

    const { data } = await supabase
      .from("ai_actions")
      .select("*")
      .eq("tenant_id",userData.tenant_id)
      .order("created_at",{ascending:false})

    setActions(data||[])
  }

  // approve
const approveAction = async(id:string)=>{

  // mark approved
  await supabase
    .from("ai_actions")
    .update({admin_approved:true})
    .eq("id",id)

  // 🔥 CALL AI EXECUTION ENGINE
  await fetch("/api/ai/execute",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({actionId:id})
  })

  alert("AI executed action 🚀")
  load()
}


  // mark executed
  const executed = async(id:string)=>{
    await supabase.from("ai_actions")
      .update({executed:true})
      .eq("id",id)

    load()
  }

  return(
    <div className="p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6">
        🤖 AI Command Center
      </h1>

      {actions.map(a=>(
        <div key={a.id} className="bg-white p-5 rounded shadow mb-4">

          <p className="font-bold text-lg">{a.action}</p>
          <p className="text-sm text-gray-500">
            Priority: {a.priority}
          </p>

          <div className="flex gap-3 mt-3">

            {!a.admin_approved && (
              <button
                onClick={()=>approveAction(a.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Approve & Execute
              </button>
            )}

            {a.admin_approved && !a.executed && (
              <button
                onClick={()=>executed(a.id)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Mark Executed
              </button>
            )}

            {a.executed && (
              <span className="text-green-600 font-bold">
                ✔ Completed
              </span>
            )}

          </div>

        </div>
      ))}

    </div>
  )
}
