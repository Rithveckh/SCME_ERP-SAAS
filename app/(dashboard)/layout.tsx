"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const path = usePathname()

  const menu = [
    { name: "Dashboard", link: "/admin" },
    { name: "Complaints", link: "/admin/complaints" },
    { name: "Billing", link: "/admin/billing" },
    { name: "Revenue", link: "/admin/revenue" },
    { name: "Inventory", link: "/admin/inventory" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
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

      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-bold">Smart Community ERP</h1>
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
