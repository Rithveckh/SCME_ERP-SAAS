"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts"

export default function RevenueDashboard(){

  const { user } = useUser()

  const [totalRevenue,setTotalRevenue]=useState(0)
  const [payments,setPayments]=useState<any[]>([])
  const [pending,setPending]=useState<any[]>([])
  const [chartData,setChartData]=useState<any[]>([])

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData?.tenant_id) return
      const tenant=userData.tenant_id

      // payments
      const { data:paymentData } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id",tenant)

      setPayments(paymentData || [])

      // total revenue
      let total=0
      paymentData?.forEach(p=>{
        total+=Number(p.amount)
      })
      setTotalRevenue(total)

      // pending bills
      const { data:pendingBills } = await supabase
        .from("bills")
        .select("*")
        .eq("tenant_id",tenant)
        .eq("status","unpaid")

      setPending(pendingBills || [])

      // monthly chart
      const monthMap:any={}

      paymentData?.forEach(p=>{
        const month=new Date(p.paid_on).toLocaleString("default",{month:"short"})
        if(!monthMap[month]) monthMap[month]=0
        monthMap[month]+=Number(p.amount)
      })

      const chartArr = Object.keys(monthMap).map(m=>({
        month:m,
        amount:monthMap[m]
      }))

      setChartData(chartArr)
    }

    load()
  },[user])

  return(
    <div className="p-10 bg-gray-100 min-h-screen text-gray-900">

      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* total revenue */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-gray-500">Total Revenue Collected</h2>
        <p className="text-3xl font-bold text-green-600">
          ₹ {totalRevenue}
        </p>
      </div>

      {/* chart */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="month"/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="amount"/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* payment history */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>

        {payments.map(p=>(
          <div key={p.id} className="border-b py-2">
            <p>Amount: ₹{p.amount}</p>
            <p className="text-green-600">Method: {p.method}</p>
          </div>
        ))}
      </div>

      {/* defaulters */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Pending Payments (Defaulters)
        </h2>

        {pending.map(b=>(
          <div key={b.id} className="border-b py-2">
            <p>Amount: ₹{b.amount}</p>
            <p>Month: {b.month}</p>
            <p className="text-red-600">Status: unpaid</p>
          </div>
        ))}
      </div>

    </div>
  )
}
