"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"
import { QRCodeCanvas } from "qrcode.react"


export default function ResidentID(){

  const { user } = useUser()
  const [data,setData]=useState<any>(null)

  useEffect(()=>{
    load()
  },[user])

  const load = async()=>{
    if(!user) return

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user.id)
      .single()

    setData(data)
  }

  if(!data) return null

  const qrValue = JSON.stringify({
    id:data.id,
    name:data.name,
    flat:data.flat_no,
    tenant:data.tenant_id
  })

  return(
    <div className="max-w-md mx-auto">

      <div className="bg-gradient-to-br from-purple-600 to-indigo-700
      text-white p-6 rounded-3xl shadow-2xl">

        <h2 className="text-xl font-bold mb-4 text-center">
          🪪 Resident Digital ID
        </h2>

        <div className="bg-white text-black p-4 rounded-2xl">

          <div className="flex gap-4 items-center">

            <img
              src={data.photo_url || "https://i.imgur.com/6VBx3io.png"}
              className="w-20 h-20 rounded-full border"
            />

            <div>
              <p className="font-bold text-lg">{data.name}</p>
              <p>Flat: {data.flat_no}</p>
              <p>Block: {data.block}</p>
              <p className="text-sm text-gray-500">{data.phone}</p>
            </div>

          </div>

          <div className="flex justify-center mt-6">
            <QRCodeCanvas value={qrValue} size={130}/>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            Scan at security gate
          </p>

        </div>
      </div>

    </div>
  )
}
