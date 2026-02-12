import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export async function POST(req:Request){
 try{

  // const { actionId } = await req.json()
  
  // 🟢 SAFE JSON PARSE
  let body:any = {}
  try{
    body = await req.json()
  }catch{
    body = {}
  }

  const actionId = body?.actionId
  if(!actionId){
    return NextResponse.json({ok:true})
  }

  const { data:action } = await supabase
    .from("ai_actions")
    .select("*")
    .eq("id",actionId)
    .single()

  if(!action) return NextResponse.json({success:false})

  const text = action.action.toLowerCase()
  const tenant = action.tenant_id

  // =========================================
  // 📦 INVENTORY RESTOCK
  // =========================================
  if(text.includes("low stock")){
    const item = action.action.split(":")[1]?.split(".")[0]?.trim()

    if(item){
      await supabase
        .from("inventory")
        .update({quantity:20})
        .ilike("item_name",item)

      await supabase.from("notifications").insert([{
        tenant_id:tenant,
        message:`AI auto-restocked ${item}`,
        type:"inventory"
      }])
    }
  }

  // =========================================
  // 👷 AUTO HIRE STAFF
  // =========================================
  if(text.includes("hire")){

    await supabase.from("users").insert([{
      name:"AI Hired Staff",
      role:"staff",
      tenant_id:tenant,
      email:`ai_staff_${Date.now()}@erp.com`
    }])

    await supabase.from("notifications").insert([{
      tenant_id:tenant,
      message:"AI hired new maintenance staff",
      type:"staff"
    }])
  }

  // =========================================
  // 💰 ADD PARKING CHARGES TO ALL RESIDENTS
  // =========================================
  if(text.includes("parking")){

    const { data:residents } = await supabase
      .from("users")
      .select("*")
      .eq("tenant_id",tenant)
      .eq("role","resident")

    for(const r of residents||[]){
      await supabase.from("bills").insert([{
        tenant_id:tenant,
        user_id:r.id,
        title:"Parking Charges",
        amount:500,
        status:"unpaid"
      }])
    }

    await supabase.from("notifications").insert([{
      tenant_id:tenant,
      message:"AI added parking charges to all residents",
      type:"billing"
    }])
  }

  // =========================================
  // 💸 REVENUE IMPROVEMENT → AUTO BILL
  // =========================================
  if(text.includes("revenue")){

    const { data:residents } = await supabase
      .from("users")
      .select("*")
      .eq("tenant_id",tenant)
      .eq("role","resident")

    for(const r of residents||[]){
      await supabase.from("bills").insert([{
        tenant_id:tenant,
        user_id:r.id,
        title:"Maintenance Fee",
        amount:1000,
        status:"unpaid"
      }])
    }

    await supabase.from("notifications").insert([{
      tenant_id:tenant,
      message:"AI generated maintenance bills to improve revenue",
      type:"finance"
    }])
  }

  // =========================================
  // 🛠 AUTO ASSIGN STAFF TO COMPLAINTS
  // =========================================
  if(text.includes("complaint")){

    const { data:staff } = await supabase
      .from("users")
      .select("*")
      .eq("tenant_id",tenant)
      .eq("role","staff")
      .limit(1)
      .single()

    if(staff){
      await supabase
        .from("complaints")
        .update({assigned_staff:staff.id})
        .eq("tenant_id",tenant)
        .is("assigned_staff",null)
    }

    await supabase.from("notifications").insert([{
      tenant_id:tenant,
      message:"AI auto-assigned staff to complaints",
      type:"complaints"
    }])
  }

  // =========================================
  // MARK EXECUTED
  // =========================================
  await supabase
    .from("ai_actions")
    .update({
      status:"completed",
      executed_by_ai:true
    })
    .eq("id",actionId)

  return NextResponse.json({success:true})

 }catch(err){
  console.log(err)
  return NextResponse.json({success:false})
 }
}
