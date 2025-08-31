import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - Modern Template",
  description: "Sign in to your account or create a new one",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
      
      {/* Right side - Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          
          {/* Content overlay */}
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Welcome to Modern Template</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of developers building amazing applications
              </p>
              <div className="space-y-4 text-left max-w-md">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="opacity-80">Modern design system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="opacity-80">Secure authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="opacity-80">Real-time database</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="opacity-80">Production ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
