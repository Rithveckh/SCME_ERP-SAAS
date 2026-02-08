import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req: Request){

  const { message, tenant } = await req.json()
  const msg = message.toLowerCase()

  // total residents
  if(msg.includes("resident")){
    const { count } = await supabase
      .from("users")
      .select("*",{count:"exact",head:true})
      .eq("tenant_id",tenant)
      .eq("role","resident")

    return NextResponse.json({
      reply:`Total residents: ${count}`
    })
  }

  // complaints
  if(msg.includes("complaint")){
    const { count } = await supabase
      .from("complaints")
      .select("*",{count:"exact",head:true})
      .eq("tenant_id",tenant)

    return NextResponse.json({
      reply:`Total complaints: ${count}`
    })
  }

  // revenue
  if(msg.includes("revenue") || msg.includes("money")){
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("tenant_id",tenant)

    let total=0
    data?.forEach(p=> total+=Number(p.amount))

    return NextResponse.json({
      reply:`Total revenue collected: ₹${total}`
    })
  }

  // inventory
  if(msg.includes("stock") || msg.includes("inventory")){
    const { data } = await supabase
      .from("inventory")
      .select("*")
      .eq("tenant_id",tenant)

    return NextResponse.json({
      reply:`Total inventory items: ${data?.length}`
    })
  }

  return NextResponse.json({
    reply:"I can help with residents, revenue, complaints, inventory."
  })
}
