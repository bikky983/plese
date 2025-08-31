"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline"
import { auth, isSupabaseConfigured } from "@/lib/supabase"
import { cn, isValidEmail } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Authentication is not configured. Please contact support.")
      }

      const { error } = await auth.resetPassword(email)
      if (error) throw error
      
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "An error occurred while sending the reset email")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to reset your password. The link will expire in 1 hour.
          </p>
          
          <div className="pt-4 space-y-3">
            <button
              onClick={() => {
                setSuccess(false)
                setEmail("")
                setError("")
              }}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Didn't receive the email? Try again
            </button>
            
            <div>
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MT</span>
          </div>
          <span className="font-bold text-xl text-foreground">Modern Template</span>
        </Link>
        
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center space-x-3"
        >
          <ExclamationCircleIcon className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending reset link...
            </>
          ) : (
            <>
              Send reset link
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
