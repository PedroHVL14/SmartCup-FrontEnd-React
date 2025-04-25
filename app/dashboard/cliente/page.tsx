"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Search, Edit, Wallet, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ClienteForm } from "@/components/cliente/cliente-form"
import { AlertNotification } from "@/components/ui/alert-notification"
import { motion } from "framer-motion"

export default function ClientePage() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://smartcupapi.onrender.com/cliente")
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes")
      }
      const data = await response.json()
      setClientes(data.resultado)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: "Erro ao carregar clientes.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  const handleEdit = (cliente: any) => {
    setSelectedCliente(cliente)
    setIsEditFormOpen(true)
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!confirm(`Tem certeza que deseja ${currentStatus ? "desativar" : "ativar"} este cliente?`)) return

    try {
      const response = await fetch(`https://smartcupapi.onrender.com/cliente/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ativo: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao ${currentStatus ? "desativar" : "ativar"} cliente`)
      }

      setAlert({
        show: true,
        message: `Cliente ${currentStatus ? "desativado" : "ativado"} com sucesso!`,
        type: "success",
      })

      fetchClientes()
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: `Erro ao ${currentStatus ? "desativar" : "ativar"} cliente.`,
        type: "error",
      })
    }
  }

  const filteredClientes = clientes.filter(
    (cliente: any) => cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.cpf.includes(searchTerm),
  )

  // Função para formatar CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
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
            <Users className="h-8 w-8" /> Clientes
          </h1>
          <p className="text-gray-500 mt-1">Gerencie os clientes do sistema</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
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
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Visualize e gerencie todos os clientes cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
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
                          <TableHead className="font-semibold">CPF</TableHead>
                          <TableHead className="font-semibold">Data de Nascimento</TableHead>
                          <TableHead className="font-semibold">Saldo</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="text-right font-semibold">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <motion.tbody variants={container} initial="hidden" animate="show">
                        {filteredClientes.length > 0 ? (
                          filteredClientes.map((cliente: any) => (
                            <motion.tr key={cliente.id} className="hover:bg-gray-50" variants={item}>
                              <TableCell className="font-medium">{cliente.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                                    {cliente.nome.charAt(0).toUpperCase()}
                                  </div>
                                  {cliente.nome}
                                </div>
                              </TableCell>
                              <TableCell>{formatCPF(cliente.cpf)}</TableCell>
                              <TableCell>{formatDate(cliente.data_nascimento)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Wallet className="h-4 w-4 mr-1 text-green-600" />
                                  R$ {cliente.saldo_restante.toFixed(2)}
                                </div>
                              </TableCell>
                              <TableCell>
                                {cliente.ativo ? (
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
                                      onClick={() => handleEdit(cliente)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className={`h-8 w-8 ${cliente.ativo ? "text-red-600" : "text-green-600"}`}
                                      onClick={() => handleToggleStatus(cliente.id, cliente.ativo)}
                                    >
                                      {cliente.ativo ? (
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
                                <Users className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-lg font-medium">Nenhum cliente encontrado</p>
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

      {/* Formulário para novo cliente */}
      <ClienteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchClientes} />

      {/* Formulário para editar cliente */}
      {selectedCliente && (
        <ClienteForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSuccess={fetchClientes}
          cliente={selectedCliente}
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
