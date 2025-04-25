"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="h-full border-none bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="bg-blue-100 rounded-lg p-3 inline-flex mb-4 group-hover:bg-blue-200 transition-colors"
        >
          <div className="text-blue-600">{icon}</div>
        </motion.div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}
