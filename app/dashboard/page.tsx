"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la página principal
    router.replace("/")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirigiendo...</h1>
        <p className="text-gray-600">Serás redirigido a la página principal</p>
      </div>
    </div>
  )
}
