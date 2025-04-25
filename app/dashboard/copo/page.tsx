"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GlassWaterIcon as Glass, Plus, Search, Edit, User, Wine, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CopoForm } from "@/components/copo/copo-form"
import { AlertNotification } from "@/components/ui/alert-notification"
import { motion } from "framer-motion"

export default function CopoPage() {
  const [copos, setCopos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [selectedCopo, setSelectedCopo] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const fetchCopos = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://smartcupapi.onrender.com/copo")
      if (!response.ok) {
        throw new Error("Erro ao buscar copos")
      }
      const data = await response.json()
      setCopos(data.resultado)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: "Erro ao carregar copos.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCopos()
  }, [])

  const handleEdit = (copo: any) => {
    setSelectedCopo(copo)
    setIsEditFormOpen(true)
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!confirm(`Tem certeza que deseja ${currentStatus ? "desativar" : "ativar"} este copo?`)) return

    try {
      const response = await fetch(`https://smartcupapi.onrender.com/copo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao ${currentStatus ? "desativar" : "ativar"} copo`)
      }

      setAlert({
        show: true,
        message: `Copo ${currentStatus ? "desativado" : "ativado"} com sucesso!`,
        type: "success",
      })

      fetchCopos()
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: `Erro ao ${currentStatus ? "desativar" : "ativar"} copo.`,
        type: "error",
      })
    }
  }

  const filteredCopos = copos.filter(
    (copo: any) =>
      copo.codigo_nfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (copo.cliente && copo.cliente.nome && copo.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR")
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
            <Glass className="h-8 w-8" /> Copos
          </h1>
          <p className="text-gray-500 mt-1">Gerencie os copos com chip NFC do sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Copo
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
            <CardTitle>Lista de Copos</CardTitle>
            <CardDescription>Visualize e gerencie todos os copos cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por código NFC ou cliente..."
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
                          <TableHead className="font-semibold">Código NFC</TableHead>
                          <TableHead className="font-semibold">Capacidade</TableHead>
                          <TableHead className="font-semibold">Cliente</TableHead>
                          <TableHead className="font-semibold">Permite Álcool</TableHead>
                          <TableHead className="font-semibold">Data de Criação</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="text-right font-semibold">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <motion.tbody variants={container} initial="hidden" animate="show">
                        {filteredCopos.length > 0 ? (
                          filteredCopos.map((copo: any) => (
                            <motion.tr key={copo.id} className="hover:bg-gray-50" variants={item}>
                              <TableCell className="font-medium">{copo.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                                    <Glass className="h-4 w-4" />
                                  </div>
                                  {copo.codigo_nfc}
                                </div>
                              </TableCell>
                              <TableCell>{copo.capacidade} ml</TableCell>
                              <TableCell>
                                {copo.cliente ? (
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1 text-blue-600" />
                                    {copo.cliente.nome}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Não associado</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {copo.permite_alcool ? (
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                    <Wine className="mr-1 h-3 w-3" /> Permitido
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Não Permitido
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{formatDate(copo.data_criacao)}</TableCell>
                              <TableCell>
                                {copo.ativo ? (
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
                                      onClick={() => handleEdit(copo)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`h-8 w-8 ${copo.ativo ? "text-red-600" : "text-green-600"}`}
                                      onClick={() => handleToggleStatus(copo.id, copo.ativo)}
                                    >
                                      {copo.ativo ? (
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
                            <TableCell colSpan={8} className="text-center py-16 text-gray-500">
                              <div className="flex flex-col items-center">
                                <Glass className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">Nenhum copo encontrado</p>
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

      {/* Formulário para novo copo */}
      <CopoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchCopos} />

      {/* Formulário para editar copo */}
      {selectedCopo && (
        <CopoForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={fetchCopos}
          copo={selectedCopo}
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
