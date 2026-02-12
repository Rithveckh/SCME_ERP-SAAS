"use client"

import { Suspense } from "react"
import AdminDashboard from "./AdminDashboard"

export default function Page(){
  return (
    <Suspense fallback={
      <div className="p-10 text-white text-xl">
        Loading Admin Dashboard...
      </div>
    }>
      <AdminDashboard/>
    </Suspense>
  )
}










