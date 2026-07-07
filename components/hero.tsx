"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Command, CornerDownLeft } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { useState, useEffect } from "react"

const examplePrompts = [
  "Help me reset my password...",
  "Where is my order #12345...",
  "How do I upgrade my plan...",
  "I need a refund for my purchase...",
  "Can you help me with billing...",
]

const trustedLogos = [
  { name: "TechCrunch", text: "TechCrunch" },
  { name: "Forbes", text: "Forbes" },
  { name: "Wired", text: "WIRED" },
  { name: "The Verge", text: "The Verge" },
  { name: "Product Hunt", text: "Product Hunt" },
]

export function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const [prompt, setPrompt] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const [displayText, setDisplayText] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    // Don't animate if user is typing or input is focused
    if (prompt || isFocused || shouldReduceMotion) {
      setDisplayText("")
      return
    }

    const currentPrompt = examplePrompts[promptIndex]
    let charIndex = 0
    let timeout: NodeJS.Timeout

    if (isTyping) {
      // Typing forward
      timeout = setInterval(() => {
        if (charIndex <= currentPrompt.length) {
          setDisplayText(currentPrompt.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(timeout)
          // Pause at end before deleting
          setTimeout(() => setIsTyping(false), 2000)
        }
      }, 50)
    } else {
      // Deleting
      charIndex = currentPrompt.length
      timeout = setInterval(() => {
        if (charIndex >= 0) {
          setDisplayText(currentPrompt.slice(0, charIndex))
          charIndex--
        } else {
          clearInterval(timeout)
          // Move to next prompt
          setPromptIndex((prev) => (prev + 1) % examplePrompts.length)
          setIsTyping(true)
        }
      }, 30)
    }

    return () => clearInterval(timeout)
  }, [promptIndex, isTyping, prompt, isFocused, shouldReduceMotion])

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center pt-28 lg:pt-32 pb-40 sm:pb-32">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-display text-balance mb-6 leading-[1.1]"
          >
            <span className="text-gradient-lime">Audit & Tax Advisory</span>
            <br />
            <span className="text-foreground">Financial Consulting & Business Management</span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed px-2"
          >
            At RSK Associates, we are more than accountants; we are trusted partners on the path to financial success.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6"
          >
            
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground/40 mb-6 pointer-events-none select-none"
            aria-hidden="true"
          >
            <span>✕</span>
            <span>◇</span>
            <span>✕</span>
            <span>◇</span>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6"
          >
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              <span className="text-gradient-lime">1,000+</span> Tusted Us
            </p>
            {/* <p className="text-muted-foreground text-xs sm:text-sm">deploy AI support agents instantly</p> */}
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="xl" rounded="full" className="gap-2 w-full sm:w-auto">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            {/* <Button variant="outline" size="xl" rounded="full" className="gap-2 bg-transparent w-full sm:w-auto">
              View Docs
              <ArrowRight className="w-4 h-4" />
            </Button> */}
          </motion.div>
        </div>
      </div>

    </section>
  )
}
