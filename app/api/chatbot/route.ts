// import { NextResponse } from "next/server"
// import OpenAI from "openai"
// import { createClient } from "@supabase/supabase-js"

// const openai = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: "https://api.groq.com/openai/v1"
// })

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_KEY!
// )

// export async function POST(req:Request){

//   try{

//   const { message, tenant } = await req.json()
//   if(!message) return NextResponse.json({reply:"Ask something"})

//   // ===== ERP DATA =====
//   const { data:payments } = await supabase
//     .from("payments")
//     .select("*")
//     .eq("tenant_id",tenant)

//   let revenue=0
//   payments?.forEach(p=> revenue+=Number(p.amount))

//   const { count:complaints } = await supabase
//     .from("complaints")
//     .select("*",{count:"exact",head:true})
//     .eq("tenant_id",tenant)

//   const { count:users } = await supabase
//     .from("users")
//     .select("*",{count:"exact",head:true})
//     .eq("tenant_id",tenant)

//   const context = `
// You are Smart Community ERP AI assistant.

// ERP DATA:
// Total revenue: ₹${revenue}
// Total complaints: ${complaints||0}
// Total users: ${users||0}

// Rules:
// - If ERP question → use ERP data
// - If general question → answer normally
// - Be smart, short and helpful
// `

//   // ===== GROQ AI CALL =====
//   const chat = await openai.chat.completions.create({
//     model: "llama-3.3-70b-versatile",   // ⭐ WORKING MODEL
//     messages: [
//       {role:"system", content:context},
//       {role:"user", content:message}
//     ]
//   })

//   const reply = chat.choices[0].message.content

//   return NextResponse.json({reply})

//   }catch(err:any){
//     console.log(err)
//     return NextResponse.json({
//       reply:"AI temporarily unavailable"
//     })
//   }
// }


import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

// 🔥 GROQ AI (ultra fast)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

// 🔵 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){

  try{

  const { message, tenant } = await req.json()
  if(!message) return NextResponse.json({reply:"Ask something"})

  // ================= ERP DATA =================

  const { data:payments } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id",tenant)

  let revenue=0
  payments?.forEach(p=> revenue+=Number(p.amount))

  const { count:complaints } = await supabase
    .from("complaints")
    .select("*",{count:"exact",head:true})
    .eq("tenant_id",tenant)

  const { count:users } = await supabase
    .from("users")
    .select("*",{count:"exact",head:true})
    .eq("tenant_id",tenant)

  // ================= CEO AI CONTEXT =================

  const context = `
You are Smart Community ERP AI — a CEO level business advisor.

You help apartment admins run operations smartly like a modern tech company.

LIVE ERP DATA:
- Total revenue: ₹${revenue}
- Total complaints: ${complaints||0}
- Total users/residents: ${users||0}

Your job:
1. Answer ERP questions using data
2. Give smart business suggestions
3. Predict problems
4. Suggest improvements
5. Answer general questions also

Rules:
- Be short and smart
- Think like startup CEO assistant
- Suggest improvements when possible
- If revenue low → suggest ways to increase
- If complaints high → suggest maintenance improvements
- If user asks general question → answer normally
`

  // ================= AI CALL =================

  const chat = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {role:"system", content:context},
      {role:"user", content:message}
    ]
  })

  const reply = chat.choices[0].message.content

  return NextResponse.json({reply})

  }catch(err:any){
    console.log(err)
    return NextResponse.json({
      reply:"AI temporarily unavailable"
    })
  }
}
