// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"
// import {
//   BarChart, Bar, LineChart, Line,
//   XAxis, YAxis, Tooltip, CartesianGrid,
//   ResponsiveContainer
// } from "recharts"
// import Chatbot from "@/app/components/Chatbot"
// import { useSearchParams } from "next/navigation"

// export default function AdminDashboard(){

//   const searchParams = useSearchParams()
//   const overrideTenant = searchParams.get("tenant")

//   const { user } = useUser()

//   const [tenant,setTenant]=useState("")
//   const [stats,setStats]=useState<any>({
//     residents:0,
//     staff:0,
//     complaints:0,
//     revenue:0
//   })

//   const [complaintChart,setComplaintChart]=useState<any[]>([])
//   const [revenueChart,setRevenueChart]=useState<any[]>([])
//   const [aiInsights,setAiInsights]=useState<string[]>([])
//   const [aiDecision,setAiDecision]=useState<string[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//     let tenantId = null
//         // 🟣 If super admin opened specific apartment
//     if(overrideTenant){
//       tenantId = overrideTenant
//     }

//     // 🔵 Normal admin login
//     else{
//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       tenantId = userData?.tenant_id
//     }

//     if(!tenantId) return
//     setTenant(tenantId)

//       // residents
//       const { count:residents } = await supabase
//         .from("users")
//         .select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenantId)
//         .eq("role","resident")

//       // staff
//       const { count:staff } = await supabase
//         .from("users")
//         .select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenantId)
//         .eq("role","staff")

//       // complaints
//       const { data:complaints } = await supabase
//         .from("complaints")
//         .select("*")
//         .eq("tenant_id",tenantId)

//       // payments
//       const { data:payments } = await supabase
//         .from("payments")
//         .select("*")
//         .eq("tenant_id",tenantId)

//       let revenue=0
//       payments?.forEach(p=> revenue+=Number(p.amount))

//       setStats({
//         residents:residents||0,
//         staff:staff||0,
//         complaints:complaints?.length||0,
//         revenue
//       })

//       // complaint chart
//       const pending = complaints?.filter(c=>c.status!=="completed").length || 0
//       const completed = complaints?.filter(c=>c.status==="completed").length || 0

//       setComplaintChart([
//         {name:"Pending", value:pending},
//         {name:"Completed", value:completed}
//       ])

//       // revenue chart
//       const monthMap:any={}
//       payments?.forEach(p=>{
//         const m=new Date(p.paid_on).toLocaleString("default",{month:"short"})
//         if(!monthMap[m]) monthMap[m]=0
//         monthMap[m]+=Number(p.amount)
//       })

//       const arr = Object.keys(monthMap).map(m=>({
//         month:m,
//         revenue:monthMap[m]
//       }))

//       setRevenueChart(arr)

//       // 🤖 predictive maintenance AI
//       const electrical = complaints?.filter(c=>c.category==="Electrical").length || 0
//       const plumbing = complaints?.filter(c=>c.category==="Plumbing").length || 0
//       const cleaning = complaints?.filter(c=>c.category==="Cleaning").length || 0

//       let insights:any=[]

//       if(electrical > 3){
//         insights.push("⚠️ Electrical complaints increasing. Check building wiring.")
//       }

//       if(plumbing > 3){
//         insights.push("🚰 Plumbing issues rising. Inspect pipelines.")
//       }

//       if(cleaning > 3){
//         insights.push("🧹 Cleaning complaints high. Improve housekeeping.")
//       }

//       if(insights.length===0){
//         insights.push("✅ System running smoothly. No major maintenance issues.")
//       }

//       setAiInsights(insights)

//       // 🧠 INDUSTRY 5.0 DECISION AI
//       let decisions:any=[]

//       // most common issue
//       const categoryCount:any={}
//       complaints?.forEach(c=>{
//         if(!categoryCount[c.category]) categoryCount[c.category]=0
//         categoryCount[c.category]++
//       })

//       let topCategory="None"
//       let max=0

//       Object.keys(categoryCount).forEach(cat=>{
//         if(categoryCount[cat]>max){
//           max=categoryCount[cat]
//           topCategory=cat
//         }
//       })

//       if(max>0){
//         decisions.push(`📊 Most common issue: ${topCategory}`)
//       }

//       // best staff
//       const { data:completedTasks } = await supabase
//         .from("complaints")
//         .select("*")
//         .eq("tenant_id",tenantId)
//         .eq("status","completed")

//       const staffCount:any={}
//       completedTasks?.forEach(c=>{
//         if(!staffCount[c.assigned_staff]) staffCount[c.assigned_staff]=0
//         staffCount[c.assigned_staff]++
//       })

//       let best=0
//       Object.keys(staffCount).forEach(s=>{
//         if(staffCount[s]>best){
//           best=staffCount[s]
//         }
//       })

//       if(best>0){
//         decisions.push("🏆 Best performing staff handling most completed tasks")
//       }

//       if((complaints?.length||0) > 10){
//         decisions.push("⚠️ High complaint volume. Consider increasing maintenance staff.")
//       }

//       if(decisions.length===0){
//         decisions.push("✅ System optimized and running efficiently")
//       }

//       setAiDecision(decisions)
//     }

//     load()
//   },[user])

//   return(
//     <div >

//       <h1 className="text-3xl font-bold mb-6 text-gray-900">🚀 Smart Admin Dashboard</h1>

//       {/* stat cards */}
//       <div className="grid grid-cols-4 gap-6 mb-10">

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <p className="text-gray-500">Residents</p>
//           <p className="text-3xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <p className="text-gray-500">Staff</p>
//           <p className="text-3xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <p className="text-gray-500">Complaints</p>
//           <p className="text-3xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
//         </div>

//       </div>

//       {/* charts */}
//       <div className="grid grid-cols-2 gap-8">

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <h2 className="font-bold mb-4">Complaint Status</h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={complaintChart}>
//               <CartesianGrid strokeDasharray="3 3"/>
//               <XAxis dataKey="name"/>
//               <YAxis/>
//               <Tooltip/>
//               <Bar dataKey="value"/>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-gray-900">
//           <h2 className="font-bold mb-4">Monthly Revenue</h2>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={revenueChart}>
//               <CartesianGrid strokeDasharray="3 3"/>
//               <XAxis dataKey="month"/>
//               <YAxis/>
//               <Tooltip/>
//               <Line type="monotone" dataKey="revenue"/>
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//       </div>

//       {/* predictive AI */}
//       <div className="bg-white p-6 rounded-xl shadow mt-10 text-gray-900">
//         <h2 className="text-xl font-bold mb-4">🤖 Predictive Maintenance AI</h2>

//         {aiInsights.map((i,index)=>(
//           <p key={index} className="mb-2 text-lg">{i}</p>
//         ))}
//       </div>

//       {/* decision AI */}
//       <div className="bg-black text-white p-6 rounded-xl shadow mt-10">
//         <h2 className="text-xl font-bold mb-4">🧠 Industry 5.0 Smart Decisions</h2>

//         {aiDecision.map((d,index)=>(
//           <p key={index} className="mb-2">{d}</p>
//         ))}
//       </div>

//       {/* chatbot */}
//       <Chatbot tenant={tenant}/>

//     </div>
//   )
// }




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
  const [aiManager,setAiManager]=useState<string[]>([])   // 🔥 SELF RUNNING AI

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      let tenantId:any = null

      // 🟣 super admin viewing specific apartment
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

      // 👥 residents
      const { count:residents } = await supabase
        .from("users")
        .select("*",{count:"exact",head:true})
        .eq("tenant_id",tenantId)
        .eq("role","resident")

      // 👷 staff
      const { count:staff } = await supabase
        .from("users")
        .select("*",{count:"exact",head:true})
        .eq("tenant_id",tenantId)
        .eq("role","staff")

      // complaints
      const { data:complaints } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_id",tenantId)

      // payments
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

      // ===========================
      // 📊 CHARTS
      // ===========================

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

      // ===========================
      // 🤖 PREDICTIVE MAINTENANCE AI
      // ===========================

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

      // ===========================
      // 🧠 DECISION AI
      // ===========================

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

      // ===========================
      // 🧠🔥 SELF RUNNING AI CEO MANAGER
      // ===========================

      let manager:any=[]

      // revenue intelligence
      if(revenue < 5000){
        manager.push("💰 Revenue low. Suggest increasing maintenance or adding paid parking.")
      }
      if(revenue > 20000){
        manager.push("📈 Revenue strong. Consider gym or EV charging station.")
      }

      // complaint intelligence
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

      // staff load
      if((complaints?.length||0) > (staff||1)*3){
        manager.push("👷 Staff overloaded. Suggest hiring more staff.")
      }

      if(manager.length===0){
        manager.push("🚀 AI Manager: System fully optimized.")
      }

      setAiManager(manager)
    }

    load()
  },[user,overrideTenant])

  return(
    <div className="text-gray-900">

      <h1 className="text-3xl font-bold mb-6 text-gray-900">🚀 Smart Admin Dashboard</h1>

      {/* stats */}
      <div className="grid grid-cols-4 gap-6 mb-10">

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

      {/* charts */}
      <div className="grid grid-cols-2 gap-8">

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

      {/* predictive AI */}
      <div className="bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🤖 Predictive Maintenance AI</h2>
        {aiInsights.map((i,index)=>(<p key={index}>{i}</p>))}
      </div>

      {/* decision AI */}
      <div className="bg-black text-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🧠 Industry 5.0 Smart Decisions</h2>
        {aiDecision.map((d,index)=>(<p key={index}>{d}</p>))}
      </div>

      {/* 🔥 SELF RUNNING CEO AI */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🧠 Self-Running AI Manager</h2>
        {aiManager.map((m,index)=>(<p key={index}>{m}</p>))}
      </div>

      {/* chatbot */}
      <Chatbot tenant={tenant}/>

    </div>
  )
}
