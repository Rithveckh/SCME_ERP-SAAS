// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser, UserButton } from "@clerk/nextjs"

// export default function SuperAdmin(){

//   const { user } = useUser()

//   const [tenants,setTenants]=useState<any[]>([])
//   const [name,setName]=useState("")

//   useEffect(()=>{
//     loadTenants()
//   },[])

//   const loadTenants = async()=>{
//     const { data } = await supabase.from("tenants").select("*")
//     setTenants(data || [])
//   }

//   const createTenant = async()=>{
//     if(!name) return alert("Enter community name")

//     await supabase.from("tenants").insert([{name}])
//     setName("")
//     loadTenants()
//   }

//   return(
//     <div className="p-10">

//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-bold">Super Admin Panel</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       {/* create tenant */}
//       <div className="bg-white p-6 rounded shadow mb-8">
//         <h2 className="text-xl text-black font-bold mb-3">Create New Community</h2>

//         <input
//           placeholder="Community name"
//           className="border p-2 mr-3 text-black"
//           value={name}
//           onChange={(e)=>setName(e.target.value)}
//         />

//         <button
//           onClick={createTenant}
//           className="bg-blue-600 text-black px-4 py-2"
//         >
//           Create
//         </button>
//       </div>

//       {/* tenant list */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl text-black font-bold mb-3">All Communities</h2>

//         {tenants.map(t=>(
//           <div key={t.id} className="border-b py-2 text-black">
//             {t.name}
//           </div>
//         ))}
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
  const [stats,setStats]=useState({
    apartments:0,
    users:0,
    revenue:0
  })

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    // all apartments
    const { data:tenantData } = await supabase
      .from("tenants")
      .select("*")

    setTenants(tenantData || [])

    // all users
    const { count:users } = await supabase
      .from("users")
      .select("*",{count:"exact",head:true})

    // revenue
    const { data:payments } = await supabase
      .from("payments")
      .select("*")

    let revenue=0
    payments?.forEach(p=> revenue+=Number(p.amount))

    setStats({
      apartments:tenantData?.length || 0,
      users:users || 0,
      revenue
    })
  }

  // add apartment
  const addApartment = async()=>{
    const name = prompt("Enter apartment name")
    if(!name) return

    await supabase.from("tenants").insert([{name}])
    alert("Apartment created")
    load()
  }

  return(
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* header */}
      <div className="bg-black text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">🌐 Super Admin SaaS Panel</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        {/* welcome */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold">Industry 5.0 Control Center</h2>
          <p>Manage all apartments & analytics</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Apartments</p>
            <p className="text-3xl font-bold">{stats.apartments}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ₹ {stats.revenue}
            </p>
          </div>

        </div>

        {/* add apartment */}
        <button
          onClick={addApartment}
          className="bg-black text-white px-6 py-3 rounded mb-6"
        >
          + Add New Apartment
        </button>

        {/* apartment list */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">🏢 All Apartments</h2>

          {tenants.map(t=>(
            <div key={t.id} className="border-b py-3 flex justify-between">
              <p className="font-bold">{t.name}</p>
              <p className="text-gray-500">ID: {t.id}</p>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
