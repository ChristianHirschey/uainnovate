"use client"
import '../app/globals.css';

import type React from "react"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface NotecardInputProps {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  maxLength?: number
}

const NotecardInput: React.FC<NotecardInputProps> = ({ placeholder, value, onChange, maxLength }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e)
  }

  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      })

      if (!response.ok) {
        throw new Error("Failed to save note")
      }

      const data = await response.json()
      setSubmitStatus({ type: "success", message: "Note saved successfully!" })

      // Optional: Clear the input after successful submission
      // setValue('');
    } catch (error) {
      console.error("Error saving note:", error)
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to save note",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          relative 
          bg-amber-50 
          rounded-md 
          shadow-md 
          border-t-2 
          border-l-2 
          border-amber-100
          ${isFocused ? "shadow-lg" : "shadow-md"}
          transition-shadow
          duration-200
          before:absolute
          before:inset-0
          before:bg-[radial-gradient(#00000003_1px,transparent_1px)]
          before:bg-[size:10px_10px]
          before:opacity-70
          before:pointer-events-none
          before:z-0
        `}
      >
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[150px] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-500 font-handwriting relative z-10"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #E6D6B2 31px, #E6D6B2 32px)",
            lineHeight: "32px",
            padding: "8px 16px",
          }}
        />
        {maxLength && (
          <div className="text-xs text-gray-500 text-right pr-3 pb-2 relative z-10">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !value.trim()}
          className={`
            relative
            w-full
            py-2
            px-4
            bg-amber-100
            hover:bg-amber-200
            active:bg-amber-300
            disabled:bg-gray-100
            disabled:text-gray-400
            rounded-md
            font-medium
            text-amber-900
            shadow-sm
            transition-colors
            duration-200
            ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Note"
          )}
        </button>

        {submitStatus && (
          <div className={`text-sm text-center ${submitStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotecardInput