"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function Wallet(){

  const { user } = useUser()
  const [wallet,setWallet]=useState<any>(null)
  const [transactions,setTransactions]=useState<any[]>([])

  useEffect(()=>{
    load()
  },[user])

  const load = async()=>{
    if(!user) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user.id)
      .single()

    if(!userData) return

    // wallet
    const { data:walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id",userData.id)
      .single()

    setWallet(walletData)

    // transactions
    const { data:txn } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id",walletData.id)
      .order("created_at",{ascending:false})

    setTransactions(txn||[])
  }

  // add money
  const addMoney = async()=>{
    const amt = prompt("Enter amount")
    if(!amt) return

    const newBal = Number(wallet.balance) + Number(amt)

    await supabase
      .from("wallets")
      .update({balance:newBal})
      .eq("id",wallet.id)

    await supabase.from("wallet_transactions").insert([{
      wallet_id:wallet.id,
      amount:amt,
      type:"credit",
      description:"Money added"
    }])

    alert("Money added")
    load()
  }

  if(!wallet) return <div className="p-10">Loading...</div>

  return(
    <div className="min-h-screen bg-gray-100 p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6">💰 My Wallet</h1>

      {/* balance */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-xl shadow mb-8">
        <p className="text-lg">Wallet Balance</p>
        <p className="text-4xl font-bold">₹ {wallet.balance}</p>

        <button
          onClick={addMoney}
          className="mt-4 bg-white text-black px-6 py-2 rounded"
        >
          Add Money
        </button>
      </div>

      {/* history */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Transactions</h2>

        {transactions.map(t=>(
          <div key={t.id} className="border-b py-3 flex justify-between">
            <div>
              <p className="font-bold">{t.description}</p>
              <p className="text-sm text-gray-500">{t.type}</p>
            </div>
            <p className="font-bold">₹ {t.amount}</p>
          </div>
        ))}

      </div>

    </div>
  )
}
