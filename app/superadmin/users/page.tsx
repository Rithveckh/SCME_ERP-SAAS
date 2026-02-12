"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { UserButton } from "@clerk/nextjs"

export default function SuperAdminUsers(){

  const [users,setUsers]=useState<any[]>([])
  const [tenants,setTenants]=useState<any[]>([])

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    // all users
    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .order("created_at",{ascending:false})

    setUsers(userData||[])

    // all apartments
    const { data:tenantData } = await supabase
      .from("tenants")
      .select("*")

    setTenants(tenantData||[])
  }

  // 🟢 APPROVE USER
  const approve = async(id:string)=>{
    await supabase
      .from("users")
      .update({approved:true})
      .eq("id",id)

    load()
  }

  // ⛔ BLOCK USER
  const block = async(id:string)=>{
    await supabase
      .from("users")
      .update({blocked:true})
      .eq("id",id)

    load()
  }

  // 🟢 UNBLOCK
  const unblock = async(id:string)=>{
    await supabase
      .from("users")
      .update({blocked:false})
      .eq("id",id)

    load()
  }

  // 🗑 DELETE
  const deleteUser = async(id:string)=>{
    if(!confirm("Delete user?")) return

    await supabase.from("users").delete().eq("id",id)
    load()
  }

  // 🎭 CHANGE ROLE
  const changeRole = async(id:string,role:string)=>{
    await supabase
      .from("users")
      .update({role})
      .eq("id",id)

    load()
  }

  // 🏢 ASSIGN APARTMENT
  const assignTenant = async(id:string,tenant:string)=>{
    await supabase
      .from("users")
      .update({tenant_id:tenant})
      .eq("id",id)

    load()
  }

  return(
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* HEADER */}
      <div className="bg-black text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">👑 Super Admin — User Control</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="p-8">

        <h2 className="text-2xl font-bold mb-6">All Registered Users</h2>

        <div className="bg-white rounded-xl shadow p-6">

          {users.map(u=>(
            <div key={u.id}
              className="border-b py-4 flex flex-col md:flex-row md:items-center justify-between"
            >

              {/* USER INFO */}
              <div>
                <p className="font-bold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>

                <div className="flex gap-3 mt-1 text-sm">
                  <span>Role: <b>{u.role}</b></span>
                  <span>Tenant: <b>{u.tenant_id || "Not assigned"}</b></span>
                </div>

                <div className="mt-1">
                  {u.approved ? (
                    <span className="text-green-600 font-bold">Approved</span>
                  ):(
                    <span className="text-orange-600 font-bold">Pending Approval</span>
                  )}

                  {u.blocked && (
                    <span className="ml-3 text-red-600 font-bold">Blocked</span>
                  )}
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-wrap gap-2 mt-3 md:mt-0">

                {!u.approved && (
                  <button
                    onClick={()=>approve(u.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Approve
                  </button>
                )}

                {!u.blocked ? (
                  <button
                    onClick={()=>block(u.id)}
                    className="bg-orange-500 text-white px-3 py-2 rounded"
                  >
                    Block
                  </button>
                ):(
                  <button
                    onClick={()=>unblock(u.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Unblock
                  </button>
                )}

                {/* ROLE */}
                <select
                  onChange={(e)=>changeRole(u.id,e.target.value)}
                  defaultValue={u.role}
                  className="border p-2"
                >
                  <option value="resident">Resident</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>

                {/* TENANT */}
                <select
                  onChange={(e)=>assignTenant(u.id,e.target.value)}
                  defaultValue={u.tenant_id || ""}
                  className="border p-2"
                >
                  <option value="">Assign Apartment</option>
                  {tenants.map(t=>(
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                {/* DELETE */}
                <button
                  onClick={()=>deleteUser(u.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}
