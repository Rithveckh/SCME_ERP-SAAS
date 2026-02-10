import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){

 try{

  const { tenant } = await req.json()
  if(!tenant) return NextResponse.json({ok:false})

  // get approved but not executed actions
  const { data:actions } = await supabase
    .from("ai_actions")
    .select("*")
    .eq("tenant_id",tenant)
    .eq("admin_approved",true)
    .eq("executed",false)

  if(!actions) return NextResponse.json({ok:true})

  for(const a of actions){

    const text = a.action.toLowerCase()

    // ==============================
    // 📦 INVENTORY RESTOCK ALERT
    // ==============================
    if(text.includes("stock")){
      await supabase.from("notifications").insert([{
        tenant_id:tenant,
        message:"AI: Inventory low. Restock required.",
        type:"inventory"
      }])
    }

    // ==============================
    // 👷 HIRE STAFF ALERT
    // ==============================
    if(text.includes("hire") || text.includes("staff")){
      await supabase.from("notifications").insert([{
        tenant_id:tenant,
        message:"AI: Suggest hiring additional staff",
        type:"staff"
      }])
    }

    // ==============================
    // 💰 REVENUE ALERT
    // ==============================
    if(text.includes("revenue")){
      await supabase.from("notifications").insert([{
        tenant_id:tenant,
        message:"AI: Revenue improvement suggestion generated",
        type:"finance"
      }])
    }

    // mark executed
    await supabase
      .from("ai_actions")
      .update({executed:true})
      .eq("id",a.id)
  }

  return NextResponse.json({ok:true})

 }catch(err){
  console.log(err)
  return NextResponse.json({ok:false})
 }

}
