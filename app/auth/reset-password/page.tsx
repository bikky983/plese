"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline"
import { auth } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Check if we have the required tokens in the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    
    if (accessToken && refreshToken) {
      setIsValidToken(true)
    } else {
      setError("Invalid or expired reset link. Please request a new one.")
    }
  }, [searchParams])

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    }
  }

  const passwordValidation = validatePassword(password)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await auth.updatePassword(password)
      if (error) throw error
      
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error: any) {
      setError(error.message || "An error occurred while updating your password")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken && !success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <ExclamationCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please request a new password reset link to continue.
          </p>
          
          <div className="pt-4 space-y-3">
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Request new reset link
            </Link>
            
            <div>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
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
            Password updated!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been successfully updated.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You'll be redirected to the login page in a moment...
          </p>
          
          <div className="pt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Continue to login
            </Link>
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
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below to complete the reset process.
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
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
          
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className={cn("w-2 h-2 rounded-full", passwordValidation.minLength ? "bg-green-500" : "bg-red-500")}></div>
                <span className={passwordValidation.minLength ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasUpperCase ? "bg-green-500" : "bg-red-500")}></div>
                <span className={passwordValidation.hasUpperCase ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasLowerCase ? "bg-green-500" : "bg-red-500")}></div>
                <span className={passwordValidation.hasLowerCase ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={cn("w-2 h-2 rounded-full", passwordValidation.hasNumbers ? "bg-green-500" : "bg-red-500")}></div>
                <span className={passwordValidation.hasNumbers ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  One number
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-input rounded-lg shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
          className={cn(
            "w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors",
            (isLoading || !passwordValidation.isValid || password !== confirmPassword) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating password...
            </>
          ) : (
            <>
              Update password
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to login
        </Link>
      </div>
    </motion.div>
  )
}
