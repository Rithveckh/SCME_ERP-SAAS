// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser, UserButton } from "@clerk/nextjs"
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   CartesianGrid, ResponsiveContainer
// } from "recharts"

// export default function AdminDashboard() {
//   const { user } = useUser()

//   const [stats,setStats] = useState({
//     residents:0,
//     staff:0,
//     complaints:0,
//     pending:0,
//     completed:0
//   })

//   const [chartData,setChartData]=useState<any[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       if(!userData?.tenant_id) return

//       const tenant = userData.tenant_id

//       // total residents
//       const { count:residents } = await supabase
//         .from("users")
//         .select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant)
//         .eq("role","resident")

//       // staff
//       const { count:staff } = await supabase
//         .from("users")
//         .select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant)
//         .eq("role","staff")

//       // all complaints
//       const { data:allComplaints } = await supabase
//         .from("complaints")
//         .select("*")
//         .eq("tenant_id",tenant)

//       const total = allComplaints?.length || 0
//       const pending = allComplaints?.filter(c=>c.status!=="completed").length || 0
//       const completed = allComplaints?.filter(c=>c.status==="completed").length || 0

//       setStats({
//         residents: residents || 0,
//         staff: staff || 0,
//         complaints: total,
//         pending,
//         completed
//       })

//       // chart data
//       setChartData([
//         {name:"Residents",value:residents || 0},
//         {name:"Staff",value:staff || 0},
//         {name:"Complaints",value:total},
//         {name:"Pending",value:pending},
//         {name:"Completed",value:completed},
//       ])
//     }

//     load()
//   },[user])

//   return (
//     <div className="p-10 bg-gray-100 min-h-screen">

//       {/* header */}
//       <div className="flex justify-between mb-8">
//         <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       <a href="/admin/revenue" className="text-blue-600 underline">
//         View Revenue Dashboard →
//       </a>


//       {/* stat cards */}
//       <div className="grid grid-cols-5 gap-6 mb-10">

//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-gray-500">Residents</h2>
//           <p className="text-2xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-gray-500">Staff</h2>
//           <p className="text-2xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-gray-500">Complaints</h2>
//           <p className="text-2xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-gray-500">Pending</h2>
//           <p className="text-2xl font-bold">{stats.pending}</p>
//         </div>

//         <div className="bg-white p-6 rounded shadow">
//           <h2 className="text-gray-500">Completed</h2>
//           <p className="text-2xl font-bold">{stats.completed}</p>
//         </div>

//       </div>

//       {/* chart */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">System Overview</h2>

//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3"/>
//             <XAxis dataKey="name"/>
//             <YAxis/>
//             <Tooltip/>
//             <Bar dataKey="value"/>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* complaint manage link */}
//       <div className="mt-8">
//         <a href="/admin/complaints" className="text-blue-600 underline">
//           Manage Complaints →
//         </a>
//       </div>

//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"

// export default function AdminDashboard(){

//   const { user } = useUser()
//   const [stats,setStats]=useState<any>({
//     residents:0,
//     staff:0,
//     complaints:0,
//     revenue:0
//   })

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       const tenant=userData.tenant_id

//       const { count:residents } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","resident")

//       const { count:staff } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","staff")

//       const { count:complaints } = await supabase
//         .from("complaints").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant)

//       const { data:payments } = await supabase
//         .from("payments").select("*").eq("tenant_id",tenant)

//       let revenue=0
//       payments?.forEach(p=> revenue+=Number(p.amount))

//       setStats({
//         residents:residents||0,
//         staff:staff||0,
//         complaints:complaints||0,
//         revenue
//       })
//     }

//     load()
//   },[user])

//   return(
//     <div>

//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-4 gap-6">

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Residents</p>
//           <p className="text-3xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Staff</p>
//           <p className="text-3xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Complaints</p>
//           <p className="text-3xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
//         </div>

//       </div>

//     </div>
//   )
// }



// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"
// import {
//   BarChart, Bar, LineChart, Line,
//   XAxis, YAxis, Tooltip, CartesianGrid,
//   ResponsiveContainer
// } from "recharts"

// export default function AdminDashboard(){

//   const { user } = useUser()

//   const [stats,setStats]=useState<any>({
//     residents:0,
//     staff:0,
//     complaints:0,
//     revenue:0
//   })

//   const [complaintChart,setComplaintChart]=useState<any[]>([])
//   const [revenueChart,setRevenueChart]=useState<any[]>([])
  

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       const tenant=userData.tenant_id

//       // basic stats
//       const { count:residents } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","resident")

//       const { count:staff } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","staff")

//       const { data:complaints } = await supabase
//         .from("complaints").select("*").eq("tenant_id",tenant)

//       const { data:payments } = await supabase
//         .from("payments").select("*").eq("tenant_id",tenant)

//       let revenue=0
//       payments?.forEach(p=> revenue+=Number(p.amount))

//       setStats({
//         residents:residents||0,
//         staff:staff||0,
//         complaints:complaints?.length||0,
//         revenue
//       })

//       // complaint chart by status
//       const pending = complaints?.filter(c=>c.status!=="completed").length || 0
//       const completed = complaints?.filter(c=>c.status==="completed").length || 0

//       setComplaintChart([
//         {name:"Pending", value:pending},
//         {name:"Completed", value:completed}
//       ])

//       // revenue chart by month
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
//     }

//     load()
//   },[user])

//   return(
//     <div>

//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {/* stat cards */}
//       <div className="grid grid-cols-4 gap-6 mb-10">

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Residents</p>
//           <p className="text-3xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Staff</p>
//           <p className="text-3xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Complaints</p>
//           <p className="text-3xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
//         </div>

//       </div>

//       {/* charts row */}
//       <div className="grid grid-cols-2 gap-8">

//         {/* complaints chart */}
//         <div className="bg-white p-6 rounded-xl shadow">
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

//         {/* revenue chart */}
//         <div className="bg-white p-6 rounded-xl shadow">
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

//     </div>
//   )
// }



// "use client"

// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"
// import {
//   BarChart, Bar, LineChart, Line,
//   XAxis, YAxis, Tooltip, CartesianGrid,
//   ResponsiveContainer
// } from "recharts"


// export default function AdminDashboard(){

//   const { user } = useUser()

//   const [stats,setStats]=useState<any>({
//     residents:0,
//     staff:0,
//     complaints:0,
//     revenue:0
//   })

//   const [complaintChart,setComplaintChart]=useState<any[]>([])
//   const [revenueChart,setRevenueChart]=useState<any[]>([])
//   const [aiInsights,setAiInsights]=useState<string[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       if(!userData?.tenant_id) return
//       const tenant=userData.tenant_id

//       // residents count
//       const { count:residents } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","resident")

//       // staff count
//       const { count:staff } = await supabase
//         .from("users").select("*",{count:"exact",head:true})
//         .eq("tenant_id",tenant).eq("role","staff")

//       // complaints
//       const { data:complaints } = await supabase
//         .from("complaints").select("*").eq("tenant_id",tenant)

//       // payments
//       const { data:payments } = await supabase
//         .from("payments").select("*").eq("tenant_id",tenant)

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
//     }

//     load()
//   },[user])

//   return(
//     <div>

//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {/* stat cards */}
//       <div className="grid grid-cols-4 gap-6 mb-10">

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Residents</p>
//           <p className="text-3xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Staff</p>
//           <p className="text-3xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Complaints</p>
//           <p className="text-3xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
//         </div>

//       </div>

//       {/* charts */}
//       <div className="grid grid-cols-2 gap-8">

//         <div className="bg-white p-6 rounded-xl shadow">
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

//         <div className="bg-white p-6 rounded-xl shadow">
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

//       {/* 🤖 AI predictive maintenance */}
//       <div className="bg-white p-6 rounded-xl shadow mt-10">
//         <h2 className="text-xl font-bold mb-4">🤖 AI Maintenance Insights</h2>

//         {aiInsights.map((i,index)=>(
//           <p key={index} className="mb-2 text-lg">{i}</p>
//         ))}
//       </div>

//     </div>
//   )
// }







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

// export default function AdminDashboard(){

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

//   useEffect(()=>{
//     if(!user) return

//     const load = async()=>{

//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       if(!userData?.tenant_id) return
//       const tenantId=userData.tenant_id
//       setTenant(tenantId)

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
//     }

//     load()
//   },[user])

//   return(
//     <div>

//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       {/* stat cards */}
//       <div className="grid grid-cols-4 gap-6 mb-10">

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Residents</p>
//           <p className="text-3xl font-bold">{stats.residents}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Staff</p>
//           <p className="text-3xl font-bold">{stats.staff}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Complaints</p>
//           <p className="text-3xl font-bold">{stats.complaints}</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow">
//           <p className="text-gray-500">Revenue</p>
//           <p className="text-3xl font-bold text-green-600">₹ {stats.revenue}</p>
//         </div>

//       </div>

//       {/* charts */}
//       <div className="grid grid-cols-2 gap-8">

//         <div className="bg-white p-6 rounded-xl shadow">
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

//         <div className="bg-white p-6 rounded-xl shadow">
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

//       {/* AI predictive insights */}
//       <div className="bg-white p-6 rounded-xl shadow mt-10">
//         <h2 className="text-xl font-bold mb-4">🤖 AI Maintenance Insights</h2>

//         {aiInsights.map((i,index)=>(
//           <p key={index} className="mb-2 text-lg">{i}</p>
//         ))}
//       </div>

//       {/* 🤖 chatbot */}
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

export default function AdminDashboard(){

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

  useEffect(()=>{
    if(!user) return

    const load = async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData?.tenant_id) return
      const tenantId=userData.tenant_id
      setTenant(tenantId)

      // residents
      const { count:residents } = await supabase
        .from("users")
        .select("*",{count:"exact",head:true})
        .eq("tenant_id",tenantId)
        .eq("role","resident")

      // staff
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

      // complaint chart
      const pending = complaints?.filter(c=>c.status!=="completed").length || 0
      const completed = complaints?.filter(c=>c.status==="completed").length || 0

      setComplaintChart([
        {name:"Pending", value:pending},
        {name:"Completed", value:completed}
      ])

      // revenue chart
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

      // 🤖 predictive maintenance AI
      const electrical = complaints?.filter(c=>c.category==="Electrical").length || 0
      const plumbing = complaints?.filter(c=>c.category==="Plumbing").length || 0
      const cleaning = complaints?.filter(c=>c.category==="Cleaning").length || 0

      let insights:any=[]

      if(electrical > 3){
        insights.push("⚠️ Electrical complaints increasing. Check building wiring.")
      }

      if(plumbing > 3){
        insights.push("🚰 Plumbing issues rising. Inspect pipelines.")
      }

      if(cleaning > 3){
        insights.push("🧹 Cleaning complaints high. Improve housekeeping.")
      }

      if(insights.length===0){
        insights.push("✅ System running smoothly. No major maintenance issues.")
      }

      setAiInsights(insights)

      // 🧠 INDUSTRY 5.0 DECISION AI
      let decisions:any=[]

      // most common issue
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

      // best staff
      const { data:completedTasks } = await supabase
        .from("complaints")
        .select("*")
        .eq("tenant_id",tenantId)
        .eq("status","completed")

      const staffCount:any={}
      completedTasks?.forEach(c=>{
        if(!staffCount[c.assigned_staff]) staffCount[c.assigned_staff]=0
        staffCount[c.assigned_staff]++
      })

      let best=0
      Object.keys(staffCount).forEach(s=>{
        if(staffCount[s]>best){
          best=staffCount[s]
        }
      })

      if(best>0){
        decisions.push("🏆 Best performing staff handling most completed tasks")
      }

      if((complaints?.length||0) > 10){
        decisions.push("⚠️ High complaint volume. Consider increasing maintenance staff.")
      }

      if(decisions.length===0){
        decisions.push("✅ System optimized and running efficiently")
      }

      setAiDecision(decisions)
    }

    load()
  },[user])

  return(
    <div>

      <h1 className="text-3xl font-bold mb-6">🚀 Industry 5.0 Smart Admin Dashboard</h1>

      {/* stat cards */}
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

        {aiInsights.map((i,index)=>(
          <p key={index} className="mb-2 text-lg">{i}</p>
        ))}
      </div>

      {/* decision AI */}
      <div className="bg-black text-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-xl font-bold mb-4">🧠 Industry 5.0 Smart Decisions</h2>

        {aiDecision.map((d,index)=>(
          <p key={index} className="mb-2">{d}</p>
        ))}
      </div>

      {/* chatbot */}
      <Chatbot tenant={tenant}/>

    </div>
  )
}
