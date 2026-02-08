import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-6">

      <h1 className="text-4xl font-bold">SCME ERP</h1>

      {/* If not logged in */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-6 py-2 rounded">
            Login
          </button>
        </SignInButton>
      </SignedOut>

      {/* If logged in */}
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
        
        <Link href="/dashboard">
          <button className="bg-blue-600 text-white px-6 py-2 rounded mt-4">
            Go to Dashboard
          </button>
        </Link>
      </SignedIn>

    </div>
  )
}
