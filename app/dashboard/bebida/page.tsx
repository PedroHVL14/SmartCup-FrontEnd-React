"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Coffee, Plus, Search, Edit, Wine, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BebidaForm } from "@/components/bebida/bebida-form"
import { AlertNotification } from "@/components/ui/alert-notification"
import { motion } from "framer-motion"

export default function BebidaPage() {
  const [bebidas, setBebidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [selectedBebida, setSelectedBebida] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const fetchBebidas = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://smartcupapi.onrender.com/bebida")
      if (!response.ok) {
        throw new Error("Erro ao buscar bebidas")
      }
      const data = await response.json()
      setBebidas(data.resultado)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: "Erro ao carregar bebidas.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBebidas()
  }, [])

  const handleEdit = (bebida: any) => {
    setSelectedBebida(bebida)
    setIsEditFormOpen(true)
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!confirm(`Tem certeza que deseja ${currentStatus ? "desativar" : "ativar"} esta bebida?`)) return

    try {
      const response = await fetch(`https://smartcupapi.onrender.com/bebida/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao ${currentStatus ? "desativar" : "ativar"} bebida`)
      }

      setAlert({
        show: true,
        message: `Bebida ${currentStatus ? "desativada" : "ativada"} com sucesso!`,
        type: "success",
      })

      fetchBebidas()
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: `Erro ao ${currentStatus ? "desativar" : "ativar"} bebida.`,
        type: "error",
      })
    }
  }

  const filteredBebidas = bebidas.filter(
    (bebida: any) =>
      bebida.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bebida.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <Coffee className="h-8 w-8" /> Bebidas
          </h1>
          <p className="text-gray-500 mt-1">Gerencie as bebidas disponíveis no sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Bebida
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
            <CardTitle>Lista de Bebidas</CardTitle>
            <CardDescription>Visualize e gerencie todas as bebidas cadastradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou descrição..."
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
                          <TableHead className="font-semibold">Preço</TableHead>
                          <TableHead className="font-semibold">Tipo</TableHead>
                          <TableHead className="font-semibold">Descrição</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="text-right font-semibold">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <motion.tbody variants={container} initial="hidden" animate="show">
                        {filteredBebidas.length > 0 ? (
                          filteredBebidas.map((bebida: any) => (
                            <motion.tr key={bebida.id} className="hover:bg-gray-50" variants={item}>
                              <TableCell className="font-medium">{bebida.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2">
                                    <Coffee className="h-4 w-4" />
                                  </div>
                                  {bebida.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-100 text-green-800">R$ {bebida.preco.toFixed(2)}</Badge>
                              </TableCell>
                              <TableCell>
                                {bebida.alcolica ? (
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                    <Wine className="mr-1 h-3 w-3" /> Alcoólica
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Não Alcoólica</Badge>
                                )}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate">{bebida.descricao}</TableCell>
                              <TableCell>
                                {bebida.ativo ? (
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
                                      onClick={() => handleEdit(bebida)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`h-8 w-8 ${bebida.ativo ? "text-red-600" : "text-green-600"}`}
                                      onClick={() => handleToggleStatus(bebida.id, bebida.ativo)}
                                    >
                                      {bebida.ativo ? (
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
                            <TableCell colSpan={7} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center">
                                <Coffee className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">Nenhuma bebida encontrada</p>
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

      {/* Formulário para nova bebida */}
      <BebidaForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchBebidas} />

      {/* Formulário para editar bebida */}
      {selectedBebida && (
        <BebidaForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={fetchBebidas}
          bebida={selectedBebida}
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
