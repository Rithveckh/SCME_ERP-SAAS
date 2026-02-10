"use client"

import { useState } from "react"

export default function Chatbot({ tenant }: { tenant: string }){

  const [open,setOpen]=useState(false)
  const [msg,setMsg]=useState("")
  const [chat,setChat]=useState<any[]>([])
  const [loading,setLoading]=useState(false)

  const send = async()=>{

    if(!msg) return

    setLoading(true)

    const userMessage = msg

    setChat(prev=>[
      ...prev,
      {from:"user",text:userMessage}
    ])

    setMsg("")

    try{
      const res = await fetch("/api/chatbot",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          message:userMessage,
          tenant:tenant
        })
      })

      const data = await res.json()

      setChat(prev=>[
        ...prev,
        {from:"bot",text:data.reply}
      ])

    }catch(err){
      setChat(prev=>[
        ...prev,
        {from:"bot",text:"Error connecting AI"}
      ])
    }

    setLoading(false)
  }

  return(
    <>
      {/* floating button */}
      <div
        onClick={()=>setOpen(!open)}
        className="fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full cursor-pointer shadow-xl"
      >
        🤖 AI
      </div>

      {/* chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-lg p-4 text-gray-900">

          <h2 className="font-bold mb-2 text-lg">ERP Assistant</h2>

          <div className="h-60 overflow-y-auto border p-2 mb-2 rounded">

            {chat.map((c,i)=>(
              <div key={i} className={`mb-2 ${c.from==="user"?"text-right":""}`}>
                <span className={`px-3 py-1 rounded ${
                  c.from==="user"
                  ?"bg-blue-600 text-white"
                  :"bg-gray-200"
                }`}>
                  {c.text}
                </span>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500">AI typing...</p>
            )}

          </div>

          <div className="flex">
            <input
              className="border flex-1 p-2 rounded-l"
              placeholder="Ask about revenue, complaints..."
              value={msg}
              onChange={(e)=>setMsg(e.target.value)}
              onKeyDown={(e)=> e.key==="Enter" && send()}
            />

            <button
              onClick={send}
              className="bg-blue-600 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  )
}
