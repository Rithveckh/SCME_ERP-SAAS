"use client"

import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ResidentAI from "@/app/components/ResidentAI"
import ResidentID from "@/app/components/ResidentID"

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

      // 🟢 create wallet if not exists
      const { data:existingWallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userData.id)
        .maybeSingle()

      if(!existingWallet){
        await supabase.from("wallets").insert([{
          user_id:userData.id,
          tenant_id:userData.tenant_id,
          balance:0
        }])
      }

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
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* TOP BAR */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏠 Resident Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        {/* welcome */}
        {/* HERO SECTION WITH DIGITAL ID */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* welcome banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-2">
              Welcome {user?.fullName}
            </h2>
            <p className="opacity-90 text-lg">
              Smart Community ERP Portal
            </p>

            <p className="mt-4 opacity-80 text-sm">
              Manage visitors • Bills • Complaints • Facilities
            </p>
          </div>

          {/* 🪪 DIGITAL ID RIGHT SIDE */}
          <div className="flex justify-center md:justify-end">
            <ResidentID />
          </div>

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
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center ">
              <div className="text-4xl mb-3">💳</div>
              <h2 className="text-xl  font-bold ">My Bills</h2>
              <p className="text-gray-500">View & pay maintenance</p>
            </div>
          </Link>

          <Link href="/resident/wallet">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">💰</div>
              <h2 className="text-xl font-bold">My Wallet</h2>
              <p className="text-gray-500">Manage wallet balance</p>
            </div>
          </Link>

          <Link href="/resident/marketplace">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h2 className="text-xl font-bold">Marketplace</h2>
              <p className="text-gray-500">Buy services from vendors</p>
            </div>
          </Link>

          <Link href="/resident/history">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">📜</div>
              <h2 className="text-xl font-bold">Complaint History</h2>
              <p className="text-gray-500">Track previous issues</p>
            </div>
          </Link>

          <Link href="/resident/visitors">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">👥</div>
              <h2 className="text-xl font-bold">Visitors</h2>
              <p className="text-gray-500">Manage visitors</p>
            </div>
          </Link>

          <Link href="/resident/community">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">🏘</div>
              <h2 className="text-xl font-bold">Community</h2>
              <p className="text-gray-500">Community posts</p>
            </div>
          </Link>

          <Link href="/resident/facility">
            <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer text-center">
              <div className="text-4xl mb-3">🏋️</div>
              <h2 className="text-xl font-bold">Facility Booking</h2>
              <p className="text-gray-500">Book facilities</p>
            </div>
          </Link>

        </div>

      </div>
      <ResidentAI />
    </div>
  )
}
