"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coffee, GlassWaterIcon as Glass, Cpu, BarChart3, TrendingUp, PieChart, Activity } from "lucide-react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    clientes: 0,
    bebidas: 0,
    copos: 0,
    maquinas: 0,
    operacoes: 0,
  })
  const [operacoes, setOperacoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados do usuário
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Carregar estatísticas e operações
    const fetchData = async () => {
      setLoading(true)
      try {
        // Buscar operações
        const operacoesResponse = await fetch("https://smartcupapi.onrender.com/operacao")
        if (!operacoesResponse.ok) {
          throw new Error("Erro ao buscar operações")
        }
        const operacoesData = await operacoesResponse.json()
        setOperacoes(operacoesData.resultado)

        // Buscar clientes
        const clientesResponse = await fetch("https://smartcupapi.onrender.com/cliente")
        if (!clientesResponse.ok) {
          throw new Error("Erro ao buscar clientes")
        }
        const clientesData = await clientesResponse.json()

        // Buscar bebidas
        const bebidasResponse = await fetch("https://smartcupapi.onrender.com/bebida")
        if (!bebidasResponse.ok) {
          throw new Error("Erro ao buscar bebidas")
        }
        const bebidasData = await bebidasResponse.json()

        // Buscar copos
        const coposResponse = await fetch("https://smartcupapi.onrender.com/copo")
        if (!coposResponse.ok) {
          throw new Error("Erro ao buscar copos")
        }
        const coposData = await coposResponse.json()

        // Buscar máquinas
        const maquinasResponse = await fetch("https://smartcupapi.onrender.com/maquina")
        if (!maquinasResponse.ok) {
          throw new Error("Erro ao buscar máquinas")
        }
        const maquinasData = await maquinasResponse.json()

        // Atualizar estatísticas
        setStats({
          clientes: clientesData.resultado.length,
          bebidas: bebidasData.resultado.length,
          copos: coposData.resultado.length,
          maquinas: maquinasData.resultado.length,
          operacoes: operacoesData.resultado.length,
        })
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Preparar dados para os gráficos
  const prepareChartData = () => {
    if (!operacoes.length)
      return { dailyOperations: [], beverageDistribution: [], machineUsage: [], clientSpending: [] }

    // Operações por dia
    const operationsByDay = operacoes.reduce((acc, op: any) => {
      const date = new Date(op.data_operacao).toLocaleDateString("pt-BR")
      if (!acc[date]) acc[date] = 0
      acc[date]++
      return acc
    }, {})

    const dailyOperations = Object.entries(operationsByDay)
      .map(([date, count]) => ({
        date,
        operacoes: count,
      }))
      .slice(-7) // Últimos 7 dias

    // Distribuição de bebidas
    const beverageCount = operacoes.reduce((acc, op: any) => {
      const bebida = op.bebida?.nome || "Desconhecida"
      if (!acc[bebida]) acc[bebida] = 0
      acc[bebida]++
      return acc
    }, {})

    const beverageDistribution = Object.entries(beverageCount).map(([name, value]) => ({
      name,
      value,
    }))

    // Uso de máquinas
    const machineCount = operacoes.reduce((acc, op: any) => {
      const maquina = op.maquina?.nome || "Desconhecida"
      if (!acc[maquina]) acc[maquina] = 0
      acc[maquina]++
      return acc
    }, {})

    const machineUsage = Object.entries(machineCount).map(([name, value]) => ({
      name,
      usos: value,
    }))

    // Valor gasto por cliente
    const clientSpending = operacoes.reduce((acc, op: any) => {
      const cliente = op.cliente?.nome || "Desconhecido"
      if (!acc[cliente]) acc[cliente] = 0
      acc[cliente] += op.saldo_gasto
      return acc
    }, {})

    const clientSpendingData = Object.entries(clientSpending)
      .map(([name, value]) => ({
        name,
        valor: value,
      }))
      .sort((a, b) => (b.valor as number) - (a.valor as number))
      .slice(0, 5) // Top 5 clientes

    return {
      dailyOperations,
      beverageDistribution,
      machineUsage,
      clientSpending: clientSpendingData,
    }
  }

  const { dailyOperations, beverageDistribution, machineUsage, clientSpending } = prepareChartData()

  // Cores para os gráficos
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"]

  // Animações
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Bem-vindo, <span className="font-medium">{user?.nome}</span>. Aqui está um resumo do sistema.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8"
      >
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
      </motion.div>

      {/* Gráficos */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Linha do tempo de operações */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle>Operações por Dia</CardTitle>
                </div>
                <CardDescription>Número de operações realizadas nos últimos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {dailyOperations.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyOperations} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="operacoes"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          name="Operações"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Não há dados suficientes para exibir o gráfico
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráficos de distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de bebidas */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <CardTitle>Distribuição de Bebidas</CardTitle>
                  </div>
                  <CardDescription>Bebidas mais consumidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {beverageDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={beverageDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {beverageDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} operações`, "Quantidade"]} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Não há dados suficientes para exibir o gráfico
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Uso de máquinas */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-amber-600" />
                    <CardTitle>Uso de Máquinas</CardTitle>
                  </div>
                  <CardDescription>Máquinas mais utilizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {machineUsage.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={machineUsage} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="usos" name="Usos" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Não há dados suficientes para exibir o gráfico
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top clientes por valor gasto */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <CardTitle>Top 5 Clientes por Valor Gasto</CardTitle>
                  </div>
                  <CardDescription>Clientes que mais gastaram no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {clientSpending.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={clientSpending}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, "Valor Gasto"]} />
                          <Legend />
                          <Bar dataKey="valor" name="Valor Gasto (R$)" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Não há dados suficientes para exibir o gráfico
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* System Info */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mt-8">
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
      </motion.div>
    </div>
  )
}
