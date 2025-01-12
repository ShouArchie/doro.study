'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const quotes = [
  "This is, by far, the best grade tracker for Waterloo students I've ever used. - Oliad",
  "Wait, when’s that due?' to 'Done and dusted!'—Doro.study keeps you ahead of the curve.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Knowledge is power. Information is liberating. Education is the premise of progress.",
]

const carouselImages = [
  { src: "/homeImages/mika-baumeister-Wpnoqo2plFA-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/stephen-dawson-qwtCeJ5cLYs-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/isaac-smith-AT77Q0Njnt0-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/priscilla-du-preez-sUF720MPYZI-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/luke-chesser-JKUTrJ4vK00-unsplash.jpg", width: 1920, height: 1080 },
  { src: "/homeImages/Screenshot 2025-01-12 004447.png", width: 1920, height: 1080 }
]

export default function Page() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  }, [])

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000) // Change quote every 5 seconds

    const imageTimer = setInterval(nextImage, 3000) // Change image every 5 seconds

    return () => {
      clearInterval(quoteTimer)
      clearInterval(imageTimer)
    }
  }, [nextImage])

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="fixed top-6 right-8 z-50">
        <span className="text-3xl font-bold uppercase">doro.study</span>
      </div>
      
      {/* Left side with carousel */}
      <div className="w-1/2 relative overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={`Carousel image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
        
        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight">
            Tracker For The Next Gen of Students
          </h1>
        </div>
      </div>

      {/* Right side with animated quote and button */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <div className="h-[100px] mb-8 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              className="text-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {quotes[currentQuote]}
            </motion.p>
          </AnimatePresence>
        </div>

        <Link href="/login">
          <Button size="lg" className="w-full text-lg">
            Start Now
          </Button>
        </Link>
      </div>
    </div>
  )
}

