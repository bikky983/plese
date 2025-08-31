"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          console.warn('Supabase is not configured. Redirecting to login.')
          router.push('/auth/login?error=supabase_not_configured')
          return
        }

        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
          // Redirect to login with error
          router.push(`/auth/login?error=${encodeURIComponent(error.message)}`)
          return
        }

        if (data.session) {
          // Successfully authenticated
          const redirectTo = searchParams.get('redirect_to') || '/dashboard'
          router.push(redirectTo)
        } else {
          // No session, redirect to login
          router.push('/auth/login')
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred')
        router.push('/auth/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Authentication Error</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/auth/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Completing sign in...</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    </div>
  )
}
