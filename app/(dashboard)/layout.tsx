"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Bell, Sun, Moon } from "lucide-react"

import { useState } from "react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const path = usePathname()
  const [open,setOpen]=useState(false)
  const closeMenu = ()=> setOpen(false)
  const [dark,setDark]=useState(true)
  const toggleTheme = ()=>{
  setDark(!dark)
  document.documentElement.classList.toggle("dark")
}

  return (
    <div className="flex h-screen bg-gray-100">

      {/* 🔴 OVERLAY (mobile only) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}


      {/* 🟢 SIDEBAR */}
      <div className={`
        fixed z-50 top-0 left-0 h-full w-64 bg-black border-r border-gray-800 p-5
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
      `}>
        <h1 className="text-xl font-bold mb-8">SCME ERP</h1>

        <nav className="space-y-4 text-lg">
          <Link href="/admin" className="block hover:text-blue-400">Dashboard</Link>
          <Link href="/admin/complaints" className="block hover:text-blue-400">Complaints</Link>
          <Link href="/admin/billing" className="block hover:text-blue-400">Billing</Link>
          <Link href="/admin/revenue" className="block hover:text-blue-400">Revenue</Link>
          <Link href="/admin/inventory" className="block hover:text-blue-400">Inventory</Link>
          <Link href="/security" className="block hover:text-blue-400">Security</Link>
          <Link href="/admin/facility" className="block hover:text-blue-400">Facility Booking</Link>
          <Link href="/admin/ai-center" className="block hover:text-blue-400">🤖 AI Command Center</Link>
        </nav>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">


        {/* TOP BAR */}
        <div className="bg-white shadow p-4 flex justify-between">
          {/* hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
          <h1 className="font-bold text-gray-900">Smart Community ERP</h1>
          <UserButton afterSignOutUrl="/" />
        </div>


        {/* PAGE CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  )
}
