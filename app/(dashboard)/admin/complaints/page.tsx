"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function AdminComplaints() {
  const { user } = useUser()

  const [complaints,setComplaints]=useState<any[]>([])
  const [staff,setStaff]=useState<any[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData?.tenant_id) return

      // complaints
      const { data:complaintData } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_id", userData.tenant_id)
        .order("created_at",{ascending:false})

      // staff list
      const { data:staffData } = await supabase
        .from("users")
        .select("*")
        .eq("tenant_id", userData.tenant_id)
        .eq("role","staff")

      setComplaints(complaintData || [])
      setStaff(staffData || [])
      setLoading(false)
    }

    load()
  },[user])

  const updateStatus = async(id:string,status:string)=>{
    await supabase.from("complaints").update({status}).eq("id",id)
    setComplaints(prev=>prev.map(c=>c.id===id?{...c,status}:c))
  }

  const assignStaff = async(id:string,staffId:string)=>{
    await supabase.from("complaints")
      .update({assigned_staff:staffId,status:"assigned"})
      .eq("id",id)

    alert("Staff assigned")
  }

  if(loading) return <div className="p-10">Loading...</div>

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Complaint Panel</h1>

      {complaints.map(c=>(
        <div key={c.id} className="border p-4 mb-4 rounded shadow text-gray-900">

          <p><b>Category:</b> {c.category}</p>
          <p><b>Description:</b> {c.description}</p>
          <p><b>Status:</b> {c.status}</p>

          {/* assign staff */}
          <div className="mt-3">
            <select
              onChange={(e)=>assignStaff(c.id,e.target.value)}
              className="border p-2"
              defaultValue=""
            >
              <option value="">Assign Staff</option>
              {staff.map(s=>(
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* status buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={()=>updateStatus(c.id,"in-progress")}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              In Progress
            </button>

            <button
              onClick={()=>updateStatus(c.id,"completed")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Completed
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}
