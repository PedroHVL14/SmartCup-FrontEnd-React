"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cpu, Plus, Search, Edit, Coffee, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MaquinaForm } from "@/components/maquina/maquina-form"
import { AlertNotification } from "@/components/ui/alert-notification"
import { motion } from "framer-motion"

export default function MaquinaPage() {
  const [maquinas, setMaquinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [selectedMaquina, setSelectedMaquina] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const fetchMaquinas = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://smartcupapi.onrender.com/maquina")
      if (!response.ok) {
        throw new Error("Erro ao buscar máquinas")
      }
      const data = await response.json()
      setMaquinas(data.resultado)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: "Erro ao carregar máquinas.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaquinas()
  }, [])

  const handleEdit = (maquina: any) => {
    setSelectedMaquina(maquina)
    setIsEditFormOpen(true)
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!confirm(`Tem certeza que deseja ${currentStatus ? "desativar" : "ativar"} esta máquina?`)) return

    try {
      const response = await fetch(`https://smartcupapi.onrender.com/maquina/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao ${currentStatus ? "desativar" : "ativar"} máquina`)
      }

      setAlert({
        show: true,
        message: `Máquina ${currentStatus ? "desativada" : "ativada"} com sucesso!`,
        type: "success",
      })

      fetchMaquinas()
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: `Erro ao ${currentStatus ? "desativar" : "ativar"} máquina.`,
        type: "error",
      })
    }
  }

  const filteredMaquinas = maquinas.filter(
    (maquina: any) =>
      maquina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (maquina.bebida && maquina.bebida.nome && maquina.bebida.nome.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calcular porcentagem do reservatório
  const calcularPorcentagem = (atual: number, max: number) => {
    return Math.round((atual / max) * 100)
  }

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
            <Cpu className="h-8 w-8" /> Máquinas
          </h1>
          <p className="text-gray-500 mt-1">Gerencie as máquinas de bebidas do sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Máquina
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
            <CardTitle>Lista de Máquinas</CardTitle>
            <CardDescription>Visualize e gerencie todas as máquinas cadastradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou bebida..."
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
                          <TableHead className="font-semibold">Nome</TableHead>
                          <TableHead className="font-semibold">Bebida</TableHead>
                          <TableHead className="font-semibold">Reservatório</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="text-right font-semibold">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <motion.tbody variants={container} initial="hidden" animate="show">
                        {filteredMaquinas.length > 0 ? (
                          filteredMaquinas.map((maquina: any) => (
                            <motion.tr key={maquina.id} className="hover:bg-gray-50" variants={item}>
                              <TableCell className="font-medium">{maquina.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                                    <Cpu className="h-4 w-4" />
                                  </div>
                                  {maquina.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                {maquina.bebida ? (
                                  <div className="flex items-center">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2">
                                      <Coffee className="h-4 w-4" />
                                    </div>
                                    {maquina.bebida.nome}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Não definida</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{maquina.qtd_reservatorio_atual} ml</span>
                                    <span>{maquina.qtd_reservatorio_max} ml</span>
                                  </div>
                                  <Progress
                                    value={calcularPorcentagem(
                                      maquina.qtd_reservatorio_atual,
                                      maquina.qtd_reservatorio_max,
                                    )}
                                    className="h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                {maquina.ativo ? (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Inativo
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleEdit(maquina)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`h-8 w-8 ${maquina.ativo ? "text-red-600" : "text-green-600"}`}
                                      onClick={() => handleToggleStatus(maquina.id, maquina.ativo)}
                                    >
                                      {maquina.ativo ? (
                                        <ToggleRight className="h-4 w-4" />
                                      ) : (
                                        <ToggleLeft className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center">
                                <Cpu className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">Nenhuma máquina encontrada</p>
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

      {/* Formulário para nova máquina */}
      <MaquinaForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchMaquinas} />

      {/* Formulário para editar máquina */}
      {selectedMaquina && (
        <MaquinaForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={fetchMaquinas}
          maquina={selectedMaquina}
          isEditing
        />
      )}

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
