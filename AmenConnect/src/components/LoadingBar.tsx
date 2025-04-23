"use client"

import type React from "react"
import { useLoading } from "./LoadingContext"
import LoadingProgressBar from "./LoadingProgressBar"

const LoadingBar: React.FC = () => {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return <LoadingProgressBar />
}

export default LoadingBar
