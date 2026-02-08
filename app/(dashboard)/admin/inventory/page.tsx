"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser, UserButton } from "@clerk/nextjs"

export default function Inventory(){

  const { user } = useUser()

  const [items,setItems]=useState<any[]>([])
  const [name,setName]=useState("")
  const [qty,setQty]=useState("")

  useEffect(()=>{
    loadItems()
  },[user])

  const loadItems = async()=>{
    if(!user) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single()

    const { data } = await supabase
      .from("inventory")
      .select("*")
      .eq("tenant_id", userData.tenant_id)

    setItems(data || [])
  }

  const addItem = async()=>{
    if(!name || !qty) return alert("Enter all fields")

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user?.id)
      .single()

    await supabase.from("inventory").insert([{
      tenant_id:userData.tenant_id,
      item_name:name,
      quantity:parseFloat(qty)
    }])

    setName("")
    setQty("")
    loadItems()
  }

  return(
    <div className="p-10">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* add item */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold mb-3">Add Item</h2>

        <input
          placeholder="Item name"
          className="border p-2 mr-3"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Quantity"
          className="border p-2 mr-3"
          value={qty}
          onChange={(e)=>setQty(e.target.value)}
        />

        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      {/* item list */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-bold mb-3">Stock</h2>

        {items.map(i=>(
          <div key={i.id} className="border-b py-2">
            {i.item_name} — Qty: {i.quantity}
          </div>
        ))}
      </div>

    </div>
  )
}
