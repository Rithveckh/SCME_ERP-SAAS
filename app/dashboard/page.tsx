"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard(){

  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(()=>{
    if(!isLoaded) return
    if(!user) return

    const routeUser = async()=>{

      // 🔴 SUPER ADMIN CHECK (from Clerk metadata)
      const clerkRole:any = user.publicMetadata?.role

      if(clerkRole === "superadmin"){
        router.push("/superadmin")
        return
      }

      // 🔵 check user in DB
      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .maybeSingle()

      // 🆕 NEW USER → auto create
      if(!userData){

        await supabase.from("users").insert([{
          clerk_id:user.id,
          email:user.primaryEmailAddress?.emailAddress,
          name:user.fullName,
          role:"resident",
          approved:false,   // must approve
          blocked:false
        }])

        router.push("/waiting-approval")
        return
      }

      // ⛔ BLOCKED USER
      if(userData.blocked){
        alert("You are blocked by super admin")
        return
      }

      // ⏳ NOT APPROVED
      if(!userData.approved){
        router.push("/waiting-approval")
        return
      }

      // ✅ ROLE BASED ROUTING
      if(userData.role==="admin"){
        router.push("/admin")
      }
      else if(userData.role==="staff"){
        router.push("/staff")
      }
      else if(userData.role==="vendor"){
        router.push("/vendor")
      }
      else{
        router.push("/resident")
      }
    }

    routeUser()
  },[user,isLoaded])

  return (
    <div className="h-screen flex items-center justify-center text-xl">
      Loading dashboard...
    </div>
  )
}
