"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { user } = useUser()
  const router = useRouter()

  const [role,setRole]=useState("")
  const [userRow,setUserRow]=useState<any>(null)

  useEffect(()=>{
    if(!user) return

    const init = async()=>{

      let { data } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!data){
        const { data:newUser } = await supabase
          .from("users")
          .insert([{
            clerk_id:user.id,
            name:user.fullName,
            email:user.primaryEmailAddress?.emailAddress
          }])
          .select()
          .single()

        data=newUser
      }

      setUserRow(data)

      // if role already exists → redirect
      if(data.role){
        if(data.role==="admin") router.push("/admin")
        else if(data.role==="staff") router.push("/staff")
        else router.push("/resident")
      }
    }

    init()
  },[user])

  // select role
  const chooseRole = async(selectedRole:string)=>{
    await supabase
      .from("users")
      .update({role:selectedRole})
      .eq("clerk_id", user?.id)

    if(selectedRole==="superadmin") router.push("/superadmin")
    else if(selectedRole==="admin") router.push("/admin")
    else if(selectedRole==="staff") router.push("/staff")
    else router.push("/resident")
  }

  // if role not selected yet
  if(!userRow?.role){
    return(
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Select Your Role</h1>

        <div className="flex gap-4">
          <button
            onClick={()=>chooseRole("resident")}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Resident
          </button>

          <button
            onClick={()=>chooseRole("staff")}
            className="bg-orange-600 text-white px-6 py-3 rounded"
          >
            Staff
          </button>

          <button
            onClick={()=>chooseRole("admin")}
            className="bg-purple-700 text-white px-6 py-3 rounded"
          >
            Admin
          </button>
        </div>
      </div>
    )
  }

  return <div className="p-10">Loading...</div>
}
