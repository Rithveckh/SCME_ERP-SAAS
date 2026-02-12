"use client"

import { useState } from "react"

export default function ScanPage(){

  const [data,setData]=useState<any>(null)

  const scan = ()=>{
    const input = prompt("Paste QR data")
    if(!input) return

    try{
      const parsed = JSON.parse(input)
      setData(parsed)
    }catch{
      alert("Invalid QR")
    }
  }

  return(
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">📷 Security Scanner</h1>

      <button
        onClick={scan}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Scan Resident ID
      </button>

      {data && (
        <div className="mt-6 bg-white p-6 rounded shadow max-w-md">
          <p><b>Name:</b> {data.name}</p>
          <p><b>Flat:</b> {data.flat}</p>
          <p className="text-green-600 font-bold mt-2">
            ✔ Access Allowed
          </p>
        </div>
      )}

    </div>
  )
}
