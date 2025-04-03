"use client"

// Modify the useVirement hook to ensure it properly sets the response
import { useState } from "react"
import axios from "axios"

interface VirementData {
  fromAccount: string
  toAccount: string
  amount: number
  description?: string
}

interface VirementResponse {
  success: boolean
  message: string
  data?: any
}

const useVirement = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<VirementResponse | null>(null)

  const makeVirement = async (virementData: VirementData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post<VirementResponse>("/api/virements", virementData, {
        withCredentials: true,
      })

      // Ensure we set the response after a successful API call
      setResponse(res.data)

      // For demo purposes, simulate a delay before completing
      // In production, you would rely on the actual API response
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred")
      setLoading(false)
    }
  }

  return { loading, error, response, makeVirement }
}

export default useVirement

