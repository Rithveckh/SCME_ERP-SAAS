// "use client"
// import { useState, useEffect } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser } from "@clerk/nextjs"

// export default function ComplaintPage() {
//   const { user } = useUser()

//   const [category,setCategory]=useState("")
//   const [desc,setDesc]=useState("")
//   const [priority,setPriority]=useState("low")
//   const [msg,setMsg]=useState("")

//   const submitComplaint = async() => {
//     if(!user) return

//     const { data:userData } = await supabase
//       .from("users")
//       .select("*")
//       .eq("clerk_id", user.id)
//       .single()

//     await supabase.from("complaints").insert([{
//       tenant_id: userData.tenant_id,
//       resident_id: userData.id,
//       category,
//       description: desc,
//       priority
//     }])

//     setMsg("Complaint submitted")
//     setCategory("")
//     setDesc("")
//   }

//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold mb-4">Raise Complaint</h1>

//       <input
//         placeholder="Category"
//         className="border p-2 block mb-3"
//         value={category}
//         onChange={(e)=>setCategory(e.target.value)}
//       />

//       <textarea
//         placeholder="Description"
//         className="border p-2 block mb-3"
//         value={desc}
//         onChange={(e)=>setDesc(e.target.value)}
//       />

//       <select
//         className="border p-2 mb-3"
//         value={priority}
//         onChange={(e)=>setPriority(e.target.value)}
//       >
//         <option>low</option>
//         <option>medium</option>
//         <option>high</option>
//       </select>

//       <button
//         onClick={submitComplaint}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Submit
//       </button>

//       <p className="text-green-600 mt-3">{msg}</p>
//     </div>
//   )
// }


"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"

export default function ComplaintPage() {

  const { user } = useUser()

  const [category,setCategory]=useState("")
  const [desc,setDesc]=useState("")
  const [priority,setPriority]=useState("low")
  const [msg,setMsg]=useState("")

  // 🔥 AI detection
  const detectAI = async()=>{
    if(!desc) return alert("Enter description first")

    const res = await fetch("/api/ai",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text:desc})
    })

    const data = await res.json()
    setCategory(data.category)
    setPriority(data.priority)
  }

  const submitComplaint = async()=>{
    if(!user) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()

    await supabase.from("complaints").insert([{
      tenant_id:userData.tenant_id,
      resident_id:userData.id,
      category,
      description:desc,
      priority
    }])

    setMsg("Complaint submitted successfully")
    setDesc("")
    setCategory("")
  }

  return(
    <div className="p-10">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Raise Complaint</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <textarea
        placeholder="Describe problem..."
        className="border p-3 w-full mb-3"
        value={desc}
        onChange={(e)=>setDesc(e.target.value)}
      />

      {/* AI BUTTON */}
      <button
        onClick={detectAI}
        className="bg-purple-700 text-white px-4 py-2 mb-4"
      >
        🤖 Auto Detect with AI
      </button>

      <input
        placeholder="Category"
        className="border p-2 w-full mb-3"
        value={category}
        onChange={(e)=>setCategory(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        value={priority}
        onChange={(e)=>setPriority(e.target.value)}
      >
        <option>low</option>
        <option>medium</option>
        <option>high</option>
      </select>

      <button
        onClick={submitComplaint}
        className="bg-blue-600 text-white px-6 py-2"
      >
        Submit Complaint
      </button>

      <p className="text-green-600 mt-3">{msg}</p>
    </div>
  )
}
