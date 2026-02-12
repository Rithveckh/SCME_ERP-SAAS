"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

export default function Community(){

  const { user } = useUser()

  const [posts,setPosts]=useState<any[]>([])
  const [content,setContent]=useState("")

  useEffect(()=>{
    load()
  },[user])

  const load = async()=>{
    if(!user) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user.id)
      .single()

    if(!userData) return

    const { data } = await supabase
      .from("community_posts")
      .select("*,users(name)")
      .eq("tenant_id",userData.tenant_id)
      .order("created_at",{ascending:false})

    setPosts(data||[])
  }

  // create post
  const createPost = async()=>{
    if(!content) return alert("Write something")

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user?.id)
      .single()

    await supabase.from("community_posts").insert([{
      tenant_id:userData.tenant_id,
      user_id:userData.id,
      content
    }])

    setContent("")
    load()
  }

  // like
  const likePost = async(postId:string)=>{
    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user?.id)
      .single()

    await supabase.from("post_likes").insert([{
      post_id:postId,
      user_id:userData.id
    }])

    load()
  }

  // comment
  const commentPost = async(postId:string)=>{
    const text = prompt("Enter comment")
    if(!text) return

    const { data:userData } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id",user?.id)
      .single()

    await supabase.from("post_comments").insert([{
      post_id:postId,
      user_id:userData.id,
      comment:text
    }])

    load()
  }

  return(
    <div className="min-h-screen bg-gray-100 p-10 text-gray-900">

      <h1 className="text-3xl font-bold mb-6">🏘 Community Feed</h1>

      {/* create post */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <textarea
          placeholder="What's happening in community?"
          className="border w-full p-3 rounded mb-3"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />

        <button
          onClick={createPost}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Post
        </button>
      </div>

      {/* posts */}
      {posts.map(p=>(
        <div key={p.id} className="bg-white p-6 rounded-xl shadow mb-6">

          <p className="font-bold">{p.users?.name}</p>
          <p className="mt-2">{p.content}</p>

          <div className="flex gap-6 mt-4">
            <button
              onClick={()=>likePost(p.id)}
              className="text-blue-600"
            >
              👍 Like
            </button>

            <button
              onClick={()=>commentPost(p.id)}
              className="text-green-600"
            >
              💬 Comment
            </button>
          </div>

        </div>
      ))}

    </div>
  )
}
