"use client"
import '../app/globals.css';

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export default function EmployeeRequestPortal() {
  const [requestContent, setRequestContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const maxLength = 500

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      setRequestContent(newValue)
    }
  }

  const handleSubmit = async () => {
    if (!requestContent.trim()) return

    try {
      const response = await fetch("https://3880-130-160-194-110.ngrok-free.app/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: requestContent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      // Clear the form after submission
      setRequestContent("")

      // Show success message
      alert("Request submitted successfully!")
    } catch (error) {
      console.error("Error submitting request:", error)
      alert("Failed to submit request")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-slate-800 mb-4 tracking-tight">Employee Request Portal</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Submit your requests to the appropriate department</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8">New Request</h2>

          <div className="mb-8">
            <label htmlFor="request-details" className="block text-lg font-medium text-slate-700 mb-4">
              Request Details
            </label>
            <div
              className={`
                relative 
                bg-amber-50 
                rounded-xl 
                shadow-md 
                border-t-2 
                border-l-2 
                border-amber-100
                ${isFocused ? "shadow-lg ring-2 ring-amber-200 ring-opacity-50" : "shadow-md"}
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:bg-[radial-gradient(#00000003_1px,transparent_1px)]
                before:bg-[size:10px_10px]
                before:opacity-70
                before:pointer-events-none
                before:z-0
                overflow-hidden
              `}
            >
              <Textarea
                id="request-details"
                placeholder="Please describe your request in detail..."
                value={requestContent}
                onChange={handleContentChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="min-h-[300px] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-500 text-lg relative z-10 p-6"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 31px, #E6D6B2 31px, #E6D6B2 32px)",
                  lineHeight: "32px",
                }}
              />
              <div className="text-sm text-gray-500 text-right pr-4 pb-3 relative z-10">
                {requestContent.length}/{maxLength}
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              onClick={handleSubmit}
              disabled={!requestContent.trim()}
              className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="mr-3 h-5 w-5" />
              Submit Request
            </Button>
          </div>
        </div>

        <div className="flex justify-center opacity-30">
          <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 0L120 30H0L60 0Z" fill="#6366F1" />
          </svg>
        </div>
      </div>
    </div>
  )
}
