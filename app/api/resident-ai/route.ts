import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){

  try{

    const { message, userId } = await req.json()
    if(!message) return NextResponse.json({reply:"Ask something"})

    // get resident data
    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single()

    if(!userData) return NextResponse.json({reply:"User not found"})

    const tenant = userData.tenant_id

    // ===== ERP DATA =====
    const { data:bills } = await supabase
      .from("payments")
      .select("*")
      .eq("tenant_id",tenant)
      .eq("user_id",userData.id)

    const pendingBills = bills?.filter(b=>b.status!=="paid").length || 0

    const { count:complaints } = await supabase
      .from("complaints")
      .select("*",{count:"exact",head:true})
      .eq("user_id",userData.id)

    const { data:visitors } = await supabase
      .from("visitors")
      .select("*")
      .eq("resident_id",userData.id)

    const context = `
You are a personal AI assistant for apartment residents.

Resident name: ${userData.name}
Apartment tenant id: ${tenant}

DATA:
Pending bills: ${pendingBills}
Total complaints raised: ${complaints||0}
Visitors expected: ${visitors?.length||0}

Rules:
- Answer like a smart personal assistant
- If ERP question → use data
- If general question → answer normally
- Be friendly, short and smart
`

    const chat = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {role:"system",content:context},
        {role:"user",content:message}
      ]
    })

    const reply = chat.choices[0].message.content

    return NextResponse.json({reply})

  }catch(err){
    console.log(err)
    return NextResponse.json({reply:"AI error"})
  }
}
