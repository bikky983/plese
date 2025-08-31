"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowRightIcon, 
  CheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline"

const features = [
  {
    name: "Beautiful Shop Builder",
    description: "Create stunning online shops with customizable banners, adjustable product grids, and professional layouts.",
    icon: SparklesIcon,
  },
  {
    name: "Easy Product Management",
    description: "Upload product images, set prices, and manage your inventory with our intuitive drag-and-drop interface.",
    icon: RocketLaunchIcon,
  },
  {
    name: "PDF Export & Sharing",
    description: "Export your shop catalog as a professional PDF and share it with customers anywhere.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Auto-Save & Cloud Storage",
    description: "Never lose your work with automatic saving and secure cloud storage for all your images and data.",
    icon: LightBulbIcon,
  },
]

const stats = [
  { name: "Active Shops", value: "100+" },
  { name: "Products Listed", value: "1000+" },
  { name: "PDF Downloads", value: "500+" },
  { name: "Happy Users", value: "250+" },
]

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur">
                <SparklesIcon className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Modern Template v1.0</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            >
              Create Your Dream Shop{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                In Minutes
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-xl mx-auto"
            >
              Build beautiful online shops with customizable layouts, easy product management, 
              and professional PDF catalogs. Perfect for showcasing your products to the world.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link
                href="/auth/signup"
                className="group rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
              >
                Create Your Shop
                <ArrowRightIcon className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shops"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Browse Shops <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-primary/20 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Trusted by shop owners worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Join thousands of businesses showcasing their products beautifully
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col bg-muted/50 p-8">
                  <dt className="text-sm font-semibold leading-6 text-muted-foreground">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful tools for beautiful shops
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our platform provides all the tools you need to create, manage, and share your online shop with ease.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                    <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to showcase your products?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of shop owners who have chosen our platform to beautifully display their products online.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              >
                Start your shop today
              </Link>
              <Link
                href="/shops"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
              >
                Browse shops <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
