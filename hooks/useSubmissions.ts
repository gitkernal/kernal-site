'use client'
import { useState, useEffect } from 'react'

interface LocalSubmission {
  id: string
  status: string
  method: string
  timestamp: string
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<LocalSubmission[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kernal_submissions')
      if (stored) setSubmissions(JSON.parse(stored))
    } catch {}
  }, [])

  function addSubmission(sub: LocalSubmission) {
    const updated = [sub, ...submissions]
    setSubmissions(updated)
    localStorage.setItem('kernal_submissions', JSON.stringify(updated))
  }

  return { submissions, addSubmission }
}
