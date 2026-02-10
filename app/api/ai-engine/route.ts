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

    // ===== GET DATA =====

    const { data:payments } = await supabase
      .from("payments")
      .select("*")
      .eq("tenant_id",tenant)

    const { data:complaints } = await supabase
      .from("complaints")
      .select("*")
      .eq("tenant_id",tenant)

    const { data:inventory } = await supabase
      .from("inventory")
      .select("*")
      .eq("tenant_id",tenant)

    const { count:staff } = await supabase
      .from("users")
      .select("*",{count:"exact",head:true})
      .eq("tenant_id",tenant)
      .eq("role","staff")

    // ===== CALCULATIONS =====

    let revenue=0
    payments?.forEach(p=> revenue+=Number(p.amount))

    let actions:any=[]

    // 💰 revenue logic
    if(revenue < 5000){
      actions.push({
        action:"Revenue low. Suggest increasing maintenance or adding parking charges",
        priority:"high"
      })
    }

    if(revenue > 30000){
      actions.push({
        action:"Revenue strong. Consider adding new facilities like gym or EV charging",
        priority:"low"
      })
    }

    // 🧰 complaints logic
    if((complaints?.length||0) > 5){
      actions.push({
        action:"High complaints detected. Hire temporary maintenance staff",
        priority:"high"
      })
    }

    if((complaints?.length||0) === 0){
      actions.push({
        action:"No complaints. System running efficiently",
        priority:"low"
      })
    }

    // 📦 inventory logic
    inventory?.forEach(i=>{
      if(i.quantity < 3){
        actions.push({
          action:`Low stock: ${i.item_name}. Restock immediately`,
          priority:"medium"
        })
      }
    })

    // 👷 staff overload
    if((complaints?.length||0) > (staff||1)*3){
      actions.push({
        action:"Staff overloaded. Suggest hiring additional staff",
        priority:"high"
      })
    }

    // ===== SAVE TO DATABASE =====

    for(const a of actions){
      await supabase.from("ai_actions").insert([{
        tenant_id:tenant,
        action:a.action,
        priority:a.priority
      }])
    }

    return NextResponse.json({
      ok:true,
      actions_generated:actions.length
    })

  }catch(err){
    console.log(err)
    return NextResponse.json({ok:false})
  }
}
