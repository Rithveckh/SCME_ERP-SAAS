import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){

  const { clerk_id, email, name } = await req.json()

  // check if user exists
  const { data:existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerk_id)
    .single()

  if(existing){
    return NextResponse.json({status:"exists"})
  }

  // default tenant (change later)
  const defaultTenant = "demo-tenant-id"

  await supabase.from("users").insert([{
    clerk_id,
    email,
    name,
    role:"resident",
    tenant_id:defaultTenant
  }])

  return NextResponse.json({status:"created"})
}
