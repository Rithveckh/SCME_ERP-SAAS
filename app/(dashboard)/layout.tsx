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

  // const menu = [
  //   { name: "Dashboard", link: "/admin" },
  //   { name: "Complaints", link: "/admin/complaints" },
  //   { name: "Billing", link: "/admin/billing" },
  //   { name: "Revenue", link: "/admin/revenue" },
  //   { name: "Inventory", link: "/admin/inventory" },
  // ]

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR
      <div className="w-64 bg-black text-white flex flex-col">

        <div className="p-5 text-xl font-bold border-b border-gray-700">
          SCME ERP
        </div>

        <div className="flex-1 p-4 space-y-2">
          {menu.map((m)=>(
            <Link key={m.link} href={m.link}>
              <div className={`p-3 rounded cursor-pointer ${
                path===m.link ? "bg-gray-800" : "hover:bg-gray-900"
              }`}>
                {m.name}
              </div>
            </Link>
          ))}
        </div>
      </div> */}

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
          <Link href="/admin/vendors" className="block hover:text-blue-400">Vendors</Link>
          <Link href="/admin/inventory" className="block hover:text-blue-400">Inventory</Link>
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
