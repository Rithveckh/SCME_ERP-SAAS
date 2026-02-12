import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(){

  const today = new Date().toISOString()

  const { data } = await supabase
    .from("tenants")
    .select("*")
    .lt("subscription_end", today)

  for(const t of data || []){
    await supabase
      .from("tenants")
      .update({
        subscription_status:"expired",
        is_active:false
      })
      .eq("id",t.id)
  }

  return NextResponse.json({ok:true})
}
