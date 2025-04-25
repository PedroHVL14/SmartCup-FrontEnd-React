"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Search, FileDown, User, Coffee, GlassWaterIcon as Glass, Cpu, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AlertNotification } from "@/components/ui/alert-notification"
import { motion } from "framer-motion"
import * as XLSX from "xlsx"

export default function OperacaoPage() {
  const [operacoes, setOperacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })
  const [exporting, setExporting] = useState(false)

  const fetchOperacoes = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://smartcupapi.onrender.com/operacao")
      if (!response.ok) {
        throw new Error("Erro ao buscar operações")
      }
      const data = await response.json()
      setOperacoes(data.resultado)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: "Erro ao carregar operações.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperacoes()
  }, [])

  const handleExportExcel = () => {
    try {
      setExporting(true)

      // Formatar dados para Excel
      const dataToExport = filteredOperacoes.map((op) => ({
        ID: op.operacao_id,
        Data: new Date(op.data_operacao).toLocaleString("pt-BR"),
        Cliente: op.cliente?.nome || "N/A",
        "CPF Cliente": op.cliente?.cpf || "N/A",
        Bebida: op.bebida?.nome || "N/A",
        "Preço Bebida": op.bebida?.preco ? `R$ ${op.bebida.preco.toFixed(2)}` : "N/A",
        Máquina: op.maquina?.nome || "N/A",
        "Código NFC": op.copo?.codigo_nfc || "N/A",
        "Valor Gasto": `R$ ${op.saldo_gasto.toFixed(2)}`,
      }))

      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Operações")

      // Converter para array buffer
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

      // Criar Blob do buffer
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Criar URL para o blob
      const url = URL.createObjectURL(blob)

      // Criar elemento de link para download
      const a = document.createElement("a")
      a.href = url
      a.download = `operacoes-smartcup-${new Date().toISOString().split("T")[0]}.xlsx`

      // Adicionar à página, clicar e remover
      document.body.appendChild(a)
      a.click()

      // Limpar
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)

      setAlert({
        show: true,
        message: "Relatório exportado com sucesso!",
        type: "success",
      })
    } catch (error) {
      console.error("Erro ao exportar:", error)
      setAlert({
        show: true,
        message: "Erro ao exportar relatório.",
        type: "error",
      })
    } finally {
      setExporting(false)
    }
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
  }

  // Aplicar filtro de pesquisa
  const filteredOperacoes = operacoes.filter((operacao: any) => {
    return (
      (operacao.cliente &&
        operacao.cliente.nome &&
        operacao.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (operacao.bebida &&
        operacao.bebida.nome &&
        operacao.bebida.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (operacao.maquina &&
        operacao.maquina.nome &&
        operacao.maquina.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (operacao.copo &&
        operacao.copo.codigo_nfc &&
        operacao.copo.codigo_nfc.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Animações
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" /> Operações
          </h1>
          <p className="text-gray-500 mt-1">Visualize o histórico de operações do sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={handleExportExcel}
            disabled={exporting || filteredOperacoes.length === 0}
          >
            {exporting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-green-600 rounded-full border-t-transparent mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" /> Exportar Relatório
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-8 overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
            <CardTitle>Histórico de Operações</CardTitle>
            <CardDescription>Visualize todas as operações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, bebida, máquina ou código NFC..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">ID</TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Data
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Cliente
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">
                              <Coffee className="h-4 w-4" />
                              Bebida
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">
                              <Cpu className="h-4 w-4" />
                              Máquina
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">
                              <Glass className="h-4 w-4" />
                              Copo
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <motion.tbody variants={container} initial="hidden" animate="show">
                        {filteredOperacoes.length > 0 ? (
                          filteredOperacoes.map((operacao: any) => (
                            <motion.tr key={operacao.operacao_id} className="hover:bg-gray-50" variants={item}>
                              <TableCell className="font-medium">{operacao.operacao_id}</TableCell>
                              <TableCell>{formatDate(operacao.data_operacao)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs mr-2">
                                    {operacao.cliente.nome.charAt(0).toUpperCase()}
                                  </div>
                                  {operacao.cliente.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2">
                                    <Coffee className="h-4 w-4" />
                                  </div>
                                  {operacao.bebida.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                                    <Cpu className="h-4 w-4" />
                                  </div>
                                  {operacao.maquina.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                                    <Glass className="h-4 w-4" />
                                  </div>
                                  {operacao.copo.codigo_nfc}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
                                  R$ {operacao.saldo_gasto.toFixed(2)}
                                </Badge>
                              </TableCell>
                            </motion.tr>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center">
                                <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">Nenhuma operação encontrada</p>
                                <p className="text-sm">Tente ajustar a pesquisa</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </motion.tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerta de notificação */}
      <AlertNotification
        isVisible={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </div>
  )
}
