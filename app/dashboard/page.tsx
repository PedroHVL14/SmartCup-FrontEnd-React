"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coffee, GlassWaterIcon as Glass, Cpu, BarChart3 } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    clientes: 0,
    bebidas: 0,
    copos: 0,
    maquinas: 0,
    operacoes: 0,
  })

  useEffect(() => {
    // Carregar dados do usuário
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Carregar estatísticas (simulado)
    const fetchStats = async () => {
      try {
        // Em um cenário real, você faria chamadas à API para obter esses dados
        // Por enquanto, vamos simular com dados estáticos
        setStats({
          clientes: 24,
          bebidas: 12,
          copos: 150,
          maquinas: 8,
          operacoes: 342,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Bem-vindo, <span className="font-medium">{user?.nome}</span>. Aqui está um resumo do sistema.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Clientes</p>
              <p className="text-2xl font-bold">{stats.clientes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Coffee className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bebidas</p>
              <p className="text-2xl font-bold">{stats.bebidas}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Glass className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Copos</p>
              <p className="text-2xl font-bold">{stats.copos}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Cpu className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Máquinas</p>
              <p className="text-2xl font-bold">{stats.maquinas}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Operações</p>
              <p className="text-2xl font-bold">{stats.operacoes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visão Geral do Sistema</CardTitle>
          <CardDescription>Resumo das atividades e status do Smart Cup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Operações Recentes</h3>
                <div className="bg-gray-100 rounded-md p-4 text-center">
                  <p className="text-gray-600">Dados de operações recentes serão exibidos aqui</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status das Máquinas</h3>
                <div className="bg-gray-100 rounded-md p-4 text-center">
                  <p className="text-gray-600">Status das máquinas será exibido aqui</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Versão do Sistema</span>
              <span>2.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Último Login</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Status da API</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Endpoint da API</span>
              <span className="text-gray-600">https://smartcupapi.onrender.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
