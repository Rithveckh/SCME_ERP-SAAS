// "use client"
// import Link from "next/link"
// import { UserButton } from "@clerk/nextjs"

// export default function ResidentDashboard(){
//   return(
//     <div className="p-10">
//       <div className="flex justify-between">
//         <h1 className="text-3xl font-bold">Resident Dashboard</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       <div className="mt-6">
//         <Link href="/complaint">
//           <button className="bg-green-600 text-white px-5 py-2 rounded">
//             Raise Complaint
//           </button>
//         </Link>
//       </div>
//     </div>
//   )
// }

"use client"

import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ResidentDashboard(){

  const { user } = useUser()

  const [stats,setStats]=useState({
    complaints:0,
    pending:0,
    paid:0
  })

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData) return

      // complaints
      const { data:complaints } = await supabase
        .from("complaints")
        .select("*")
        .eq("resident_id", userData.id)

      // bills
      const { data:bills } = await supabase
        .from("bills")
        .select("*")
        .eq("resident_id", userData.id)

      const totalComplaints = complaints?.length || 0
      const pendingComplaints =
        complaints?.filter(c=>c.status!=="completed").length || 0

      const paidBills =
        bills?.filter(b=>b.status==="paid").length || 0

      setStats({
        complaints:totalComplaints,
        pending:pendingComplaints,
        paid:paidBills
      })
    }

    load()
  },[user])

  return(
    <div className="min-h-screen bg-gray-100">

      {/* TOP BAR */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏠 Resident Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        {/* welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold">
            Welcome {user?.fullName}
          </h2>
          <p className="opacity-90">Smart Community ERP Portal</p>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Complaints</p>
            <p className="text-3xl font-bold">{stats.complaints}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending Issues</p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Bills Paid</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.paid}
            </p>
          </div>

        </div>

        {/* actions */}
        <div className="grid grid-cols-3 gap-6">

          <Link href="/complaint">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">🛠️</div>
              <h2 className="text-xl font-bold">Raise Complaint</h2>
              <p className="text-gray-500">Report maintenance issue</p>
            </div>
          </Link>

          <Link href="/resident/bills">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">💳</div>
              <h2 className="text-xl font-bold">My Bills</h2>
              <p className="text-gray-500">View & pay maintenance</p>
            </div>
          </Link>

          <Link href="/resident/history">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">📜</div>
              <h2 className="text-xl font-bold">Complaint History</h2>
              <p className="text-gray-500">Track previous issues</p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  )
}
