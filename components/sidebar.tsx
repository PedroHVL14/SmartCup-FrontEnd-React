"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  UserCog,
  Coffee,
  GlassWaterIcon as Glass,
  Cpu,
  BarChart3,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Fechar sidebar mobile quando mudar de rota
    setIsMobileSidebarOpen(false)

    // Verificar tamanho da tela para colapsar sidebar em telas menores
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1280)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pathname])

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Administrador",
      href: "/dashboard/administrador",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      name: "Cliente",
      href: "/dashboard/cliente",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Bebida",
      href: "/dashboard/bebida",
      icon: <Coffee className="h-5 w-5" />,
    },
    {
      name: "Copo",
      href: "/dashboard/copo",
      icon: <Glass className="h-5 w-5" />,
    },
    {
      name: "Máquina",
      href: "/dashboard/maquina",
      icon: <Cpu className="h-5 w-5" />,
    },
    {
      name: "Operação",
      href: "/dashboard/operacao",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md border-gray-200"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-[70px]" : "w-64",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center p-4 h-16 border-b">
          <div className="flex items-center gap-2 overflow-hidden">
            <Image src="/images/logo.png" alt="Smart Cup Logo" width={32} height={32} className="shrink-0" />
            <span
              className={cn(
                "font-semibold text-blue-600 transition-opacity duration-200",
                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100",
              )}
            >
              Smart Cup
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronDown
              className={cn("h-5 w-5 transition-transform", isSidebarCollapsed ? "-rotate-90" : "rotate-0")}
            />
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div
            className={cn(
              "p-4 border-b flex items-center gap-3",
              isSidebarCollapsed ? "justify-center" : "justify-start",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-medium text-sm">
                {user.nome
                  .split(" ")
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div
              className={cn(
                "overflow-hidden transition-opacity duration-200",
                isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100",
              )}
            >
              <p className="font-medium text-sm truncate">{user.nome}</p>
              <p className="text-xs text-gray-500 truncate">{user.login}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100",
                    isSidebarCollapsed && "justify-center",
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span
                    className={cn(
                      "transition-opacity duration-200",
                      isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100",
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t mt-auto">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-600 hover:bg-red-50 hover:text-red-700",
              isSidebarCollapsed && "justify-center p-2",
            )}
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "ml-2 transition-opacity duration-200",
                isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100",
              )}
            >
              Sair
            </span>
          </Button>
        </div>
      </aside>
    </>
  )
}
