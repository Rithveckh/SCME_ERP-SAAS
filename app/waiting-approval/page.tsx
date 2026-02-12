"use client"

import { UserButton } from "@clerk/nextjs"

export default function Waiting(){

  return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">

      <div className="bg-white p-10 rounded-xl shadow text-center">

        <h1 className="text-3xl font-bold mb-4">
          ⏳ Waiting for Approval
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been created successfully.
          <br/>
          Please wait for super admin approval.
        </p>

        <div className="flex justify-center">
          <UserButton afterSignOutUrl="/" />
        </div>

      </div>

    </div>
  )
}
