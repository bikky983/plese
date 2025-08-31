"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shops", href: "/shops" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Modern Template</span>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MT</span>
              </div>
              <span className="font-bold text-xl text-foreground">Shop Builder</span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          
          <Link
            href="/auth/login"
            className="text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          
          <Link
            href="/auth/signup"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <motion.div
        className={cn(
          "lg:hidden",
          mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"
        )}
        initial={false}
        animate={mobileMenuOpen ? "open" : "closed"}
      >
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          variants={{
            open: { opacity: 1 },
            closed: { opacity: 0 }
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
        <motion.div
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border"
          variants={{
            open: { x: 0 },
            closed: { x: "100%" }
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Shop Builder</span>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SB</span>
                </div>
                <span className="font-bold text-lg text-foreground">Shop Builder</span>
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {theme === "dark" ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <Link
                  href="/auth/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-foreground hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                
                <Link
                  href="/auth/signup"
                  className="-mx-3 block rounded-lg bg-primary px-3 py-2.5 text-base font-semibold leading-7 text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
