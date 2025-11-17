"use client"
import { useEffect } from "react"

export default function AuthGate() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const path = window.location.pathname
    const isPublic = path === "/login" || path === "/"
    if (!token && !isPublic) {
      window.location.replace("/login")
    }
  }, [])
  return null
}