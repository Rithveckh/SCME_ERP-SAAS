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
    <div className="p-10 text-gray-900">

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

        {/* {items.map(i=>(
          <div key={i.id} className="border-b py-2 ">
            {i.item_name} — Qty: {i.quantity}
          </div>
        ))} */}
        {items.map(item=>{

  const lowStock = item.quantity < 3

  return(
    <div 
      key={item.id} 
      className={`p-4 mb-4 rounded border shadow
        ${lowStock ? "bg-red-900 border-red-500" : "bg-gray-900 border-gray-700"}
      `}
    >

      <p className="text-lg font-semibold text-white">{item.item_name}</p>

      <p className={`text-xl font-bold 
        ${lowStock ? "text-red-400" : "text-green-400"}
      `}>
        Stock: {item.quantity}
      </p>

      {lowStock && (
        <p className="text-red-500 font-semibold mt-2">
          ⚠ Low stock — refill needed
        </p>
      )}

    </div>
  )
})}

      </div>

    </div>
  )
}
