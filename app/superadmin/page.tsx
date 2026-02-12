"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { UserButton } from "@clerk/nextjs"

export default function SuperAdmin(){

  const [tenants,setTenants]=useState<any[]>([])
  const [adminMap,setAdminMap]=useState<any>({})
  const [stats,setStats]=useState({
    apartments:0,
    users:0,
    admins:0,
    complaints:0,
    revenue:0
  })

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    // apartments
    const { data:tenantData } = await supabase
      .from("tenants")
      .select("*")

    setTenants(tenantData||[])

    // users
    const { data:users } = await supabase
      .from("users")
      .select("*")

    // complaints
    const { count:complaints } = await supabase
      .from("complaints")
      .select("*",{count:"exact",head:true})

    // payments
    const { data:payments } = await supabase
      .from("payments")
      .select("*")

    let revenue=0
    payments?.forEach(p=> revenue+=Number(p.amount))

    // admins per tenant
    const map:any={}
    users?.forEach(u=>{
      if(u.role==="admin"){
        map[u.tenant_id]=true
      }
    })
    setAdminMap(map)

    const adminCount = users?.filter(u=>u.role==="admin").length || 0

    setStats({
      apartments:tenantData?.length||0,
      users:users?.length||0,
      admins:adminCount,
      complaints:complaints||0,
      revenue
    })
  }

  // ➕ add apartment
  const addApartment = async()=>{
    const name = prompt("Enter apartment name")
    if(!name) return

    await supabase.from("tenants").insert([{name}])
    alert("Apartment created")
    load()
  }

  // 👑 create admin for apartment
  const createAdmin = async(tenantId:string)=>{

    const email = prompt("Enter admin email")
    if(!email) return

    const { data:user } = await supabase
      .from("users")
      .select("*")
      .eq("email",email)
      .single()

    if(!user){
      alert("User must signup first")
      return
    }

    await supabase
      .from("users")
      .update({
        role:"admin",
        tenant_id:tenantId,
        approved:true
      })
      .eq("id",user.id)

    alert("Admin assigned")
    load()
  }

  return(
    <div className="min-h-screen text-white relative overflow-hidden
    bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]">

      {/* glowing bg */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px]
        bg-purple-600 opacity-30 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px]
        bg-cyan-500 opacity-20 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🌐 Super Admin Control Center
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* HERO */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl mb-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Industry 5.0 Intelligence Panel</h2>
          <p className="text-gray-300">
            Manage apartments • Users • Revenue • AI analytics
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 grid-cols-2 gap-6 mb-10">

          {[
            {title:"Apartments",value:stats.apartments,icon:"🏢"},
            {title:"Users",value:stats.users,icon:"👥"},
            {title:"Admins",value:stats.admins,icon:"🛡"},
            {title:"Complaints",value:stats.complaints,icon:"📢"},
            {title:"Revenue",value:"₹ "+stats.revenue,icon:"💰"}
          ].map((s,i)=>(
            <div key={i}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-400">{s.title}</p>
                <span className="text-xl">{s.icon}</span>
              </div>

              <p className="text-3xl font-bold mt-3 text-purple-400">
                {s.value}
              </p>
            </div>
          ))}

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mb-10 flex-wrap">

          <button
            onClick={addApartment}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:scale-105"
          >
            + Add Apartment
          </button>

          {/* 🔥 USER CONTROL PANEL */}
          <a href="/superadmin/users">
            <button className="px-6 py-3 rounded-xl bg-blue-600 shadow-lg hover:scale-105">
              👥 Manage Users
            </button>
          </a>

        </div>

        {/* APARTMENTS LIST */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-6">🏢 All Communities</h2>

          {tenants.map(t=>{
            const hasAdmin = adminMap[t.id]

            return(
              <div key={t.id}
                className="flex flex-col md:flex-row justify-between border-b border-white/10 py-5"
              >

                <div>
                  <p className="text-lg font-bold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.id}</p>

                  {hasAdmin ? (
                    <p className="text-green-400 font-bold mt-1">🟢 Admin Assigned</p>
                  ):(
                    <p className="text-red-400 font-bold mt-1">🔴 No Admin</p>
                  )}
                </div>

                <div className="flex gap-3 mt-3 md:mt-0">

                  <a
                    href={`/admin?tenant=${t.id}`}
                    className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    Open Dashboard
                  </a>

                  {!hasAdmin && (
                    <button
                      onClick={()=>createAdmin(t.id)}
                      className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
                    >
                      Create Admin
                    </button>
                  )}

                </div>
              </div>
            )
          })}

        </div>

      </div>
    </div>
  )
}
