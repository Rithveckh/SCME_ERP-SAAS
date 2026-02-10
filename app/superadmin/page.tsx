// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { UserButton } from "@clerk/nextjs"

// export default function SuperAdmin(){

//   const [tenants,setTenants]=useState<any[]>([])
//   const [adminMap,setAdminMap]=useState<any>({})
//   const [loading,setLoading]=useState(true)

//   const [stats,setStats]=useState({
//     apartments:0,
//     users:0,
//     admins:0,
//     complaints:0,
//     revenue:0
//   })

//   useEffect(()=>{
//     load()
//   },[])

//   const load = async()=>{

//     const { data:tenantData } = await supabase.from("tenants").select("*")
//     setTenants(tenantData || [])

//     const { data:usersData } = await supabase.from("users").select("*")
//     const { data:complaints } = await supabase.from("complaints").select("*")
//     const { data:payments } = await supabase.from("payments").select("*")

//     // revenue
//     let revenue=0
//     payments?.forEach(p=> revenue+=Number(p.amount))

//     // admin count + map
//     const adminCount = usersData?.filter(u=>u.role==="admin").length || 0
//     const map:any={}
//     usersData?.forEach(u=>{
//       if(u.role==="admin") map[u.tenant_id]=true
//     })
//     setAdminMap(map)

//     setStats({
//       apartments:tenantData?.length || 0,
//       users:usersData?.length || 0,
//       admins:adminCount,
//       complaints:complaints?.length || 0,
//       revenue
//     })

//     setLoading(false)
//   }

//   const addApartment = async()=>{
//     const name = prompt("Enter apartment name")
//     if(!name) return
//     await supabase.from("tenants").insert([{name}])
//     load()
//   }

//   const createAdmin = async(tenantId:string)=>{
//     const email = prompt("Enter admin email")
//     const name = prompt("Enter admin name")

//     if(!email || !name) return

//     await supabase.from("users").insert([{
//       email,name,role:"admin",tenant_id:tenantId
//     }])

//     alert("Admin created successfully")
//     load()
//   }

//   if(loading){
//     return(
//       <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
//         Loading Super Admin Panel...
//       </div>
//     )
//   }

//   return(
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">🌐 Super Admin SaaS Panel</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       {/* HERO */}
//       <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl mb-10 shadow-xl">
//         <h2 className="text-2xl font-bold">Industry 5.0 Control Center</h2>
//         <p className="text-gray-300">Manage all communities & analytics</p>
//       </div>

//       {/* STATS */}
//       <div className="grid md:grid-cols-5 grid-cols-2 gap-6 mb-10">

//         {[
//           {title:"Apartments", value:stats.apartments},
//           {title:"Users", value:stats.users},
//           {title:"Admins", value:stats.admins},
//           {title:"Complaints", value:stats.complaints},
//           {title:"Revenue", value:"₹ "+stats.revenue}
//         ].map((s,i)=>(
//           <div key={i}
//             className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
//           >
//             <p className="text-gray-300">{s.title}</p>
//             <p className="text-3xl font-bold mt-2">{s.value}</p>
//           </div>
//         ))}

//       </div>

//       {/* ADD APARTMENT */}
//       <button
//         onClick={addApartment}
//         className="mb-8 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition"
//       >
//         + Add New Apartment
//       </button>

//       {/* APARTMENT LIST */}
//       <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl">
//         <h2 className="text-xl font-bold mb-6">🏢 All Apartments</h2>

//         {tenants.map(t=>{
//           const hasAdmin = adminMap[t.id]

//           return(
//             <div key={t.id}
//               className="flex justify-between items-center border-b border-white/10 py-4"
//             >
//               <div>
//                 <p className="font-bold text-lg">{t.name}</p>
//                 <p className="text-xs text-gray-400">{t.id}</p>

//                 {hasAdmin ? (
//                   <p className="text-green-400 font-bold mt-1">🟢 Admin Assigned</p>
//                 ) : (
//                   <p className="text-red-400 font-bold mt-1">🔴 No Admin</p>
//                 )}
//               </div>

//               <div className="flex gap-3">

//                 {/* open dashboard */}
//                 <a
//                   href={`/admin?tenant=${t.id}`}
//                   className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
//                 >
//                   Open Dashboard
//                 </a>

//                 {/* create admin */}
//                 {!hasAdmin && (
//                   <button
//                     onClick={()=>createAdmin(t.id)}
//                     className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
//                   >
//                     Create Admin
//                   </button>
//                 )}

//               </div>
//             </div>
//           )
//         })}
//       </div>

//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { UserButton } from "@clerk/nextjs"

export default function SuperAdmin(){

  const [tenants,setTenants]=useState<any[]>([])
  const [adminMap,setAdminMap]=useState<any>({})
  const [loading,setLoading]=useState(true)

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

    const { data:tenantData } = await supabase.from("tenants").select("*")
    const { data:usersData } = await supabase.from("users").select("*")
    const { data:complaints } = await supabase.from("complaints").select("*")
    const { data:payments } = await supabase.from("payments").select("*")

    setTenants(tenantData || [])

    let revenue=0
    payments?.forEach(p=> revenue+=Number(p.amount))

    const adminCount = usersData?.filter(u=>u.role==="admin").length || 0

    const map:any={}
    usersData?.forEach(u=>{
      if(u.role==="admin") map[u.tenant_id]=true
    })
    setAdminMap(map)

    setStats({
      apartments:tenantData?.length || 0,
      users:usersData?.length || 0,
      admins:adminCount,
      complaints:complaints?.length || 0,
      revenue
    })

    setLoading(false)
  }

  const addApartment = async()=>{
    const name = prompt("Enter apartment name")
    if(!name) return
    await supabase.from("tenants").insert([{name}])
    load()
  }

  const createAdmin = async(tenantId:string)=>{
    const email = prompt("Enter admin email")
    const name = prompt("Enter admin name")

    if(!email || !name) return

    await supabase.from("users").insert([{
      email,name,role:"admin",tenant_id:tenantId
    }])

    alert("Admin created 🚀")
    load()
  }

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center bg-black text-white text-2xl">
        🚀 Loading Ultra Panel...
      </div>
    )
  }

  return(
    <div className="min-h-screen text-white relative overflow-hidden
bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#020617]">

{/* glowing gradient background */}
<div className="absolute inset-0 -z-10">

  <div className="absolute top-0 left-0 w-[500px] h-[500px]
  bg-purple-600 opacity-30 blur-[140px] rounded-full"></div>

  <div className="absolute bottom-0 right-0 w-[500px] h-[500px]
  bg-cyan-500 opacity-20 blur-[140px] rounded-full"></div>

</div>

      <div className="relative z-10 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🌐 Super Admin Control Center
          </h1>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* HERO */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl mb-10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Intelligence Panel</h2>
          <p className="text-gray-300">
            Manage all communities • Admins • Revenue • AI analytics
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 grid-cols-2 gap-6 mb-12">

          {[
            {title:"Apartments",value:stats.apartments,icon:"🏢"},
            {title:"Users",value:stats.users,icon:"👥"},
            {title:"Admins",value:stats.admins,icon:"🛡"},
            {title:"Complaints",value:stats.complaints,icon:"📢"},
            {title:"Revenue",value:"₹ "+stats.revenue,icon:"💰"}
          ].map((s,i)=>(
            <div key={i}
              className="group backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:border-purple-400"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-400">{s.title}</p>
                <span className="text-xl">{s.icon}</span>
              </div>

              <p className="text-3xl font-bold mt-3 group-hover:text-purple-400 transition">
                {s.value}
              </p>
            </div>
          ))}

        </div>

        {/* ADD APARTMENT BUTTON */}
        <button
          onClick={addApartment}
          className="mb-10 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all shadow-lg"
        >
          + Add New Apartment
        </button>

        {/* APARTMENTS */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold mb-8">🏢 All Communities</h2>

          {tenants.map(t=>{
            const hasAdmin = adminMap[t.id]

            return(
              <div key={t.id}
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 py-5 hover:bg-white/5 px-3 rounded-xl transition"
              >
                <div>
                  <p className="text-lg font-bold">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.id}</p>

                  {hasAdmin ? (
                    <p className="text-green-400 font-bold mt-1">🟢 Admin Assigned</p>
                  ) : (
                    <p className="text-red-400 font-bold mt-1">🔴 No Admin Assigned</p>
                  )}
                </div>

                <div className="flex gap-3 mt-3 md:mt-0">

                  <a
                    href={`/admin?tenant=${t.id}`}
                    className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 shadow-lg"
                  >
                    Open Dashboard
                  </a>

                  {!hasAdmin && (
                    <button
                      onClick={()=>createAdmin(t.id)}
                      className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition shadow-lg"
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
