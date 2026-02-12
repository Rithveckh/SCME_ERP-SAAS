"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer
} from "recharts"
import Chatbot from "@/app/components/Chatbot"
import { useSearchParams } from "next/navigation"

export default function AdminDashboard(){

  const searchParams = useSearchParams()
  const overrideTenant = searchParams.get("tenant")

  const { user } = useUser()

  const [tenant,setTenant]=useState("")
  const [stats,setStats]=useState<any>({
    residents:0,
    staff:0,
    complaints:0,
    revenue:0
  })

  const [complaintChart,setComplaintChart]=useState<any[]>([])
  const [revenueChart,setRevenueChart]=useState<any[]>([])
  const [aiInsights,setAiInsights]=useState<string[]>([])
  const [aiDecision,setAiDecision]=useState<string[]>([])
  const [aiManager,setAiManager]=useState<string[]>([])
  const [performance,setPerformance]=useState<any[]>([])
  const [health,setHealth]=useState<any>(null)



  useEffect(()=>{
    // 🔥 RUN AI ENGINE
    fetch("/api/ai/execute",{method:"POST"})
    if(!user) return

    const load = async()=>{

      let tenantId:any = null

      // 🟣 super admin view
      if(overrideTenant){
        tenantId = overrideTenant
      }
      // 🔵 normal admin
      else{
        const { data:userData } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", user.id)
          .single()

        tenantId = userData?.tenant_id
      }

      if(!tenantId) return
      setTenant(tenantId)

      /* =====================================================
      💰 SaaS SUBSCRIPTION CHECK
      ===================================================== */

      const { data:sub } = await supabase
        .from("tenant_subscriptions")
        .select("*,subscription_plans(name)")
        .eq("tenant_id", tenantId)
        .eq("status","active")
        .maybeSingle()

      // no subscription
      if(!sub){
        alert("⚠ No active subscription for this apartment.\nContact Super Admin.")
        return
      }

      // expired
      if(sub.end_date && new Date(sub.end_date) < new Date()){
        alert("⚠ Subscription expired.\nRenew plan to continue.")
        return
      }

      await fetch("/api/ai-executor",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({tenant:tenantId})
      })
      // =============================
      // BASIC STATS
      // =============================

      const { count:residents } = await supabase
        .from("users")
        .select("*",{count:"exact",head:true})
        .eq("tenant_id",tenantId)
        .eq("role","resident")

      const { count:staff } = await supabase
        .from("users")
        .select("*",{count:"exact",head:true})
        .eq("tenant_id",tenantId)
        .eq("role","staff")

      const { data:complaints } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_id",tenantId)

      const { data:payments } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id",tenantId)

      let revenue=0
      payments?.forEach(p=> revenue+=Number(p.amount))

      setStats({
        residents:residents||0,
        staff:staff||0,
        complaints:complaints?.length||0,
        revenue
      })

      // =============================
      // CHARTS
      // =============================

      const pending = complaints?.filter(c=>c.status!=="completed").length || 0
      const completed = complaints?.filter(c=>c.status==="completed").length || 0

      setComplaintChart([
        {name:"Pending", value:pending},
        {name:"Completed", value:completed}
      ])

      const monthMap:any={}
      payments?.forEach(p=>{
        const m=new Date(p.paid_on).toLocaleString("default",{month:"short"})
        if(!monthMap[m]) monthMap[m]=0
        monthMap[m]+=Number(p.amount)
      })

      const arr = Object.keys(monthMap).map(m=>({
        month:m,
        revenue:monthMap[m]
      }))

      setRevenueChart(arr)

    /* =====================================================
      🧠 APARTMENT HEALTH SCORE AI
    ===================================================== */

    let pendingComplaints =
      complaints?.filter(c=>c.status!=="completed").length || 0

    let totalComplaints = complaints?.length || 0

    // base score
    let score = 100

    // complaints reduce score
    score -= pendingComplaints * 5
    score -= totalComplaints * 1

    // revenue improves score
    if(revenue > 20000) score += 10
    if(revenue < 5000) score -= 10

    // limits
    if(score>100) score=100
    if(score<0) score=0

    // health status
    let healthStatus="🟢 Excellent"
    if(score<80) healthStatus="🟡 Warning"
    if(score<50) healthStatus="🔴 Critical"

    // store in DB
    await supabase
    .from("apartment_health")
    .upsert([{
      tenant_id:tenantId,
      health_score:score,
      status:healthStatus,
      complaints:totalComplaints,
      revenue:revenue,
      pending:pendingComplaints,
      updated_at:new Date()
    }])

          // set to UI
          setHealth({
            score,
            status:healthStatus
      })

      // =============================
      // 🤖 PREDICTIVE AI
      // =============================

      const electrical = complaints?.filter(c=>c.category==="Electrical").length || 0
      const plumbing = complaints?.filter(c=>c.category==="Plumbing").length || 0
      const cleaning = complaints?.filter(c=>c.category==="Cleaning").length || 0

      let insights:any=[]

      if(electrical > 3) insights.push("⚠️ Electrical complaints rising. Check wiring.")
      if(plumbing > 3) insights.push("🚰 Plumbing issues increasing. Inspect pipelines.")
      if(cleaning > 3) insights.push("🧹 Cleaning complaints high. Improve housekeeping.")

      if(insights.length===0){
        insights.push("✅ Maintenance system stable.")
      }

      setAiInsights(insights)

      // =============================
      // 🧠 DECISION AI
      // =============================

      let decisions:any=[]

      const categoryCount:any={}
      complaints?.forEach(c=>{
        if(!categoryCount[c.category]) categoryCount[c.category]=0
        categoryCount[c.category]++
      })

      let topCategory="None"
      let max=0

      Object.keys(categoryCount).forEach(cat=>{
        if(categoryCount[cat]>max){
          max=categoryCount[cat]
          topCategory=cat
        }
      })

      if(max>0){
        decisions.push(`📊 Most common issue: ${topCategory}`)
      }

      if((complaints?.length||0) > 10){
        decisions.push("⚠️ Complaint volume high. Consider more staff.")
      }

      if(decisions.length===0){
        decisions.push("✅ System optimized")
      }

      setAiDecision(decisions)

      // =============================
      // 🧠🔥 SELF RUNNING CEO AI
      // =============================

      let manager:any=[]

      if(revenue < 5000){
        manager.push("💰 Revenue low. Suggest increasing maintenance or adding parking charges.")
      }

      if(revenue > 20000){
        manager.push("📈 Revenue strong. Consider adding gym, EV charging or new services.")
      }

      if((complaints?.length||0) > 5){
        manager.push("⚠️ Complaints rising. Hire temporary maintenance staff.")
      }

      if((complaints?.length||0) === 0){
        manager.push("🎉 Zero complaints. Community running perfectly.")
      }

      // inventory check
      const { data:inv } = await supabase
        .from("inventory")
        .select("*")
        .eq("tenant_id",tenantId)

      inv?.forEach(i=>{
        if(i.quantity < 3){
          manager.push(`📦 Low stock: ${i.item_name}. Restock soon.`)
        }
      })

      // staff overload
      if((complaints?.length||0) > (staff||1)*3){
        manager.push("👷 Staff overloaded. Suggest hiring more staff.")
      }

      if(manager.length===0){
        manager.push("🚀 AI Manager: System fully optimized.")
      }

    setAiManager(manager)

    // 🔥 STORE AI DECISIONS INTO DB (NO DUPLICATES)
  for(const actionText of manager){

    // 🔴 check if already exists and still pending
    const { data:existing } = await supabase
      .from("ai_actions")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("action", actionText)
      .eq("status","pending")
      .maybeSingle()

    // 🟢 if not exists → insert
    if(!existing){

      let priority="low"
      if(actionText.includes("⚠️") || actionText.includes("Hire")) priority="high"
      if(actionText.includes("Low stock")) priority="medium"

      await supabase.from("ai_actions").insert([{
        tenant_id: tenantId,
        action: actionText,
        priority: priority,
        status: "pending"
      }])

    }
  }


  /* =====================================================
   🏆 STAFF PERFORMANCE AI ENGINE
===================================================== */

const { data:staffList } = await supabase
  .from("users")
  .select("*")
  .eq("tenant_id",tenantId)
  .eq("role","staff")

for(const s of staffList || []){

  // completed tasks
  const { count:completed } = await supabase
    .from("complaints")
    .select("*",{count:"exact",head:true})
    .eq("assigned_staff",s.id)
    .eq("status","completed")

  // attendance
  const { count:attendance } = await supabase
    .from("staff_attendance")
    .select("*",{count:"exact",head:true})
    .eq("staff_id",s.id)

  // score formula
  const score = (completed||0)*10 + (attendance||0)*2

  let remark="Average"
  if(score>80) remark="🏆 Excellent performer"
  if(score<20) remark="⚠️ Needs improvement"

  await supabase.from("staff_performance").upsert([{
    tenant_id:tenantId,
    staff_id:s.id,
    tasks_completed:completed||0,
    attendance_days:attendance||0,
    performance_score:score,
    remark
  }])
}

/* ===== FETCH PERFORMANCE TABLE ===== */

const { data:perf } = await supabase
  .from("staff_performance")
  .select("*,users(name)")
  .eq("tenant_id",tenantId)
  .order("performance_score",{ascending:false})

setPerformance(perf||[])


    }
    
    load()
  },[user,overrideTenant])

  return(
    <div className="text-gray-900 p-6">

      <h1 className="text-3xl font-bold mb-6">🚀 Smart Admin Dashboard</h1>

      {/* stats */}
      <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Residents</p>
          <p className="text-3xl font-bold">{stats.residents}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Staff</p>
          <p className="text-3xl font-bold">{stats.staff}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Complaints</p>
          <p className="text-3xl font-bold">{stats.complaints}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Revenue</p>
          <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
        </div>

      </div>

      {/* 🧠 HEALTH SCORE CARD */}
      {health && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-bold">🏥 Apartment Health Score</h2>
          <p className="text-4xl font-bold mt-2">{health.score}%</p>
          <p className="text-lg mt-1">{health.status}</p>
        </div>
      )}

      {/* charts */}
      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Complaint Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintChart}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="revenue"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* predictive */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🤖 Predictive Maintenance AI</h2>
        {aiInsights.map((i,index)=>(<p key={index}>{i}</p>))}
      </div>

      {/* decision */}
      <div className="bg-black text-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🧠 Industry 5.0 Smart Decisions</h2>
        {aiDecision.map((d,index)=>(<p key={index}>{d}</p>))}
      </div>

      {/* CEO AI */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🧠 Self-Running AI Manager</h2>
        {aiManager.map((m,index)=>(<p key={index}>{m}</p>))}
      </div>

      {/* 🏆 STAFF PERFORMANCE */}
<div className="bg-white p-6 rounded-xl shadow mt-10">
  <h2 className="text-xl font-bold mb-4">
    🏆 Staff Performance Leaderboard
  </h2>

  {performance.length===0 && (
    <p className="text-gray-500">No staff performance data</p>
  )}

  {performance.map((p,index)=>(
    <div key={p.id}
      className="flex justify-between border-b py-3">

      <div>
        <p className="font-bold">
          #{index+1} {p.users?.name || "Staff"}
        </p>
        <p className="text-sm text-gray-500">
          Tasks: {p.tasks_completed} | Attendance: {p.attendance_days}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold text-purple-600">
          Score: {p.performance_score}
        </p>
        <p>{p.remark}</p>
      </div>

    </div>
  ))}
</div>


      {/* chatbot */}
      <Chatbot tenant={tenant}/>

    </div>
  )
}
