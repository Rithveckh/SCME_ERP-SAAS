// import { NextResponse } from "next/server"
// import { createClient } from "@supabase/supabase-js"

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_KEY!
// )

// export async function POST(req:Request){

//   const { clerk_id, email, name } = await req.json()

//   // check if user exists
//   const { data:existing } = await supabase
//     .from("users")
//     .select("*")
//     .eq("clerk_id", clerk_id)
//     .single()

//   if(existing){
//     return NextResponse.json({status:"exists"})
//   }

//   // default tenant (change later)
//   const defaultTenant = "b8329d58-356d-4c46-a4be-e18a032892d2"

//   await supabase.from("users").insert([{
//     clerk_id,
//     email,
//     name,
//     role:"resident",
//     tenant_id:defaultTenant
//   }])

//   return NextResponse.json({status:"created"})
// }

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){

  const { clerk_id, email, name } = await req.json()

  // check existing
  const { data:existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerk_id)
    .single()

  if(existing){
    return NextResponse.json({status:"exists"})
  }

  // ⭐ YOUR SUPER ADMIN EMAIL
  const SUPER_ADMIN_EMAIL = "ridham4113@gmail.com"

  let role="resident"
  let tenant_id="demo1"

  if(email === SUPER_ADMIN_EMAIL){
    role="superadmin"
    tenant_id="master"
  }

  await supabase.from("users").insert([{
    clerk_id,
    email,
    name,
    role,
    tenant_id
  }])

  return NextResponse.json({status:"created"})
}
