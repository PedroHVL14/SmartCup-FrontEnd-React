"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  LogIn,
  Instagram,
  Coffee,
  BarChart,
  Settings,
  Headphones,
  ArrowRight,
  Users,
  GiftIcon,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import FeatureCard from "@/components/feature-card"
import Header from "@/components/header"

export default function Home() {
  const [pauseAutoSlide, setPauseAutoSlide] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const carouselRef = useRef(null)
  const autoSlideIntervalRef = useRef(null)

  const sectionRefs = {
    hero: useRef(null),
    vantagens: useRef(null),
    about: useRef(null),
    team: useRef(null),
  }

  const features = [
    {
      title: "Experiência Inovadora",
      description: "Proporcione uma experiência interativa e única para os clientes com copos inteligentes.",
      icon: <Coffee className="h-8 w-8" />,
    },
    {
      title: "Autoatendimento",
      description: "Agilize o processo de pedidos e pagamentos através da tecnologia NFC.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Personalização",
      description: "Ofereça promoções e recomendações personalizadas com base nos hábitos dos clientes.",
      icon: <GiftIcon className="h-8 w-8" />,
    },
    {
      title: "Relatórios Detalhados",
      description: "Acesse dados e insights valiosos sobre o comportamento e preferências dos clientes.",
      icon: <BarChart className="h-8 w-8" />,
    },
    {
      title: "Integração Simples",
      description: "Conecte-se facilmente com sistemas existentes e outras plataformas de gestão.",
      icon: <Settings className="h-8 w-8" />,
    },
    {
      title: "Suporte 24/7",
      description: "Tenha suporte técnico especializado disponível a qualquer momento.",
      icon: <Headphones className="h-8 w-8" />,
    },
  ]

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const section = sectionRefs[sectionId]?.current
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for header height
        behavior: "smooth",
      })
    }
  }

  // Auto-slide functionality
  useEffect(() => {
    if (!pauseAutoSlide && carouselRef.current) {
      autoSlideIntervalRef.current = setInterval(() => {
        if (carouselRef.current?.api) {
          carouselRef.current.api.scrollNext()
        }
      }, 2000)
    }

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [pauseAutoSlide])

  // Intersection Observer to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section id="hero" ref={sectionRefs.hero} className="relative pt-24 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.div variants={fadeInUp} className="w-full md:w-1/2 space-y-6 z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient leading-tight tracking-tight">
                Transforme sua experiência de atendimento
              </h1>
              <p className="text-xl text-gray-700 max-w-xl">
                O Smart Cup utiliza tecnologia NFC para revolucionar a interação entre estabelecimentos e clientes,
                trazendo mais agilidade e personalização.
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-6 h-auto rounded-xl animated-button"
                    asChild
                  >
                    <Link href="/login">
                      Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="text-lg px-6 py-6 h-auto rounded-xl border-2"
                    onClick={() => scrollToSection("vantagens")}
                  >
                    Saiba mais <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full md:w-1/2 relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-pulse"></div>
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 2, 0, -2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Smart Cup Illustration"
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto drop-shadow-xl image-glow relative z-10"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -z-10 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-100 rounded-full -z-10 blur-3xl opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-purple-100 rounded-full -z-10 blur-2xl opacity-40"></div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-12 w-12 bg-white/30 backdrop-blur-sm border border-white/50"
            onClick={() => scrollToSection("vantagens")}
          >
            <ChevronDown className="h-6 w-6 text-blue-600" />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="vantagens" ref={sectionRefs.vantagens} className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto max-w-6xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Vantagens do Smart Cup</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra como nossa solução pode transformar a experiência dos seus clientes e otimizar o seu negócio.
            </p>
          </div>

          {/* Improved Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" ref={sectionRefs.about} className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto max-w-4xl"
        >
          <Card className="p-8 border-none shadow-lg rounded-2xl bg-gradient-to-br from-white to-blue-50 overflow-hidden relative">
            <motion.div
              className="absolute -right-20 -top-20 w-40 h-40 bg-blue-100 rounded-full opacity-50"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />
            <h2 className="text-3xl font-bold mb-6 text-gradient relative z-10">Sobre o Projeto</h2>
            <p className="text-gray-700 leading-relaxed text-lg relative z-10">
              O Smart Cup, utilizando copos com chips NFC, inova na interação entre estabelecimentos comerciais e
              clientes, atendendo à crescente demanda por autoatendimento e conveniência. Esta solução se destaca das
              abordagens tradicionais ao oferecer um método mais eficiente e personalizado para promoções e pagamentos,
              melhorando significativamente a experiência do cliente e otimizando processos operacionais.
            </p>
            <motion.div
              className="mt-8 text-center relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="rounded-full border-blue-400 text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/login">
                  Conheça nossa plataforma <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </section>

      {/* Team Section */}
      <section id="team" ref={sectionRefs.team} className="py-20 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto max-w-6xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Conheça Nossa Equipe</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Profissionais dedicados a criar a melhor experiência para o seu negócio.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-10">
            <motion.div
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
              onClick={() => window.open("https://www.instagram.com/pedro.vitorino14/")}
              className="cursor-pointer group bg-white rounded-xl p-6 transition-all duration-300"
            >
              <div className="mb-5 flex justify-center">
                <div className="rounded-full bg-blue-100 p-6 transition-all duration-300 group-hover:bg-blue-200 shadow-md group-hover:shadow-lg">
                  <Instagram className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-2xl mb-2">Pedro Vitorino</h3>
              <p className="text-gray-600">Desenvolvedor Full Stack</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
              onClick={() => window.open("https://www.instagram.com/leonardosextare")}
              className="cursor-pointer group bg-white rounded-xl p-6 transition-all duration-300"
            >
              <div className="mb-5 flex justify-center">
                <div className="rounded-full bg-blue-100 p-6 transition-all duration-300 group-hover:bg-blue-200 shadow-md group-hover:shadow-lg">
                  <Instagram className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-2xl mb-2">Leonardo Sextare</h3>
              <p className="text-gray-600">Desenvolvedor Full Stack</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center gap-4">
              <Image src="/images/logo.png" alt="Smart Cup Logo" width={50} height={50} className="h-12 w-auto" />
              <div>
                <span className="text-gradient font-bold text-xl">Smart Cup</span>
                <p className="text-gray-400 text-sm">Transformando experiências</p>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="text-center text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Smart Cup. Todos os direitos reservados.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Políticas de Privacidade
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
