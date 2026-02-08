// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useUser, UserButton } from "@clerk/nextjs"

// export default function ResidentBills(){
//   const { user } = useUser()
//   const [bills,setBills]=useState<any[]>([])

//   useEffect(()=>{
//     if(!user) return

//     const load=async()=>{
//       const { data:userData } = await supabase
//         .from("users")
//         .select("*")
//         .eq("clerk_id", user.id)
//         .single()

//       const { data } = await supabase
//         .from("bills")
//         .select("*")
//         .eq("resident_id", userData.id)

//       setBills(data || [])
//     }

//     load()
//   },[user])

//   const payBill = async(bill:any)=>{
//     await supabase.from("payments").insert([{
//       bill_id:bill.id,
//       tenant_id:bill.tenant_id,
//       amount:bill.amount,
//       method:"UPI"
//     }])

//     await supabase.from("bills")
//       .update({status:"paid"})
//       .eq("id",bill.id)

//     alert("Payment successful")
//     location.reload()
//   }

//   return(
//     <div className="p-10">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-3xl font-bold">My Bills</h1>
//         <UserButton afterSignOutUrl="/" />
//       </div>

//       {bills.map(b=>(
//         <div key={b.id} className="border p-4 mb-3">
//           <p>Month: {b.month}</p>
//           <p>Amount: ₹{b.amount}</p>
//           <p>Status: {b.status}</p>

//           {b.status==="unpaid" && (
//             <button
//               onClick={()=>payBill(b)}
//               className="bg-green-600 text-white px-4 py-2 mt-2"
//             >
//               Pay Now
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"
import jsPDF from "jspdf"

export default function ResidentBills(){

  const { user } = useUser()
  const [bills,setBills]=useState<any[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!user) return

    const load=async()=>{

      const { data:userData } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single()

      if(!userData) return

      const { data } = await supabase
        .from("bills")
        .select("*")
        .eq("resident_id", userData.id)
        .order("created_at",{ascending:false})

      setBills(data || [])
      setLoading(false)
    }

    load()
  },[user])

  // 💰 pay bill
  const payBill = async(bill:any)=>{
    await supabase.from("payments").insert([{
      bill_id:bill.id,
      tenant_id:bill.tenant_id,
      amount:bill.amount,
      method:"UPI"
    }])

    await supabase
      .from("bills")
      .update({status:"paid"})
      .eq("id",bill.id)

    alert("Payment successful")
    location.reload()
  }

  // 📄 download PDF invoice
  const downloadInvoice = (bill:any)=>{

    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("SCME ERP - Maintenance Invoice", 20, 20)

    doc.setFontSize(12)
    doc.text(`Invoice ID: ${bill.id}`, 20, 40)
    doc.text(`Month: ${bill.month}`, 20, 50)
    doc.text(`Amount: ₹ ${bill.amount}`, 20, 60)
    doc.text(`Status: ${bill.status}`, 20, 70)

    doc.text("Resident Copy", 20, 100)

    doc.save(`invoice-${bill.month}.pdf`)
  }

  if(loading){
    return <div className="p-10">Loading bills...</div>
  }

  return(
    <div className="p-10 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">My Bills</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {bills.length===0 && (
        <div className="bg-white p-6 rounded shadow">
          No bills generated yet.
        </div>
      )}

      {bills.map(b=>(
        <div key={b.id} className="bg-white p-6 rounded-xl shadow mb-4">

          <p className="text-lg"><b>Month:</b> {b.month}</p>
          <p><b>Amount:</b> ₹ {b.amount}</p>
          <p><b>Status:</b> {b.status}</p>

          <div className="mt-4">

            {b.status==="unpaid" && (
              <button
                onClick={()=>payBill(b)}
                className="bg-green-600 text-white px-5 py-2 mr-3 rounded"
              >
                Pay Now
              </button>
            )}

            <button
              onClick={()=>downloadInvoice(b)}
              className="bg-black text-white px-5 py-2 rounded"
            >
              Download Invoice
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}

