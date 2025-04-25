"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import { AlertNotification } from "@/components/ui/alert-notification"

interface ClienteFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  cliente?: any
  isEditing?: boolean
}

export function ClienteForm({ isOpen, onClose, onSuccess, cliente, isEditing = false }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    cpf: cliente?.cpf || "",
    data_nascimento: cliente?.data_nascimento ? new Date(cliente.data_nascimento).toISOString().split("T")[0] : "",
    saldo_restante: cliente?.saldo_restante !== undefined ? cliente.saldo_restante : 0,
    ativo: cliente?.ativo !== undefined ? cliente.ativo : true,
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, ativo: checked }))
  }

  // Função para formatar CPF enquanto digita
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")

    if (value.length <= 11) {
      setFormData((prev) => ({ ...prev, cpf: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = "https://smartcupapi.onrender.com/cliente"
      let method = "POST"
      let submitData: any = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação
        data_nascimento: formData.data_nascimento,
      }

      if (isEditing) {
        url = `${url}/${cliente.id}`
        method = "PATCH"
        submitData = {
          ...submitData,
          saldo_restante: Number.parseFloat(formData.saldo_restante.toString()),
          ativo: formData.ativo,
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar cliente")
      }

      setAlert({
        show: true,
        message: `Cliente ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`,
        type: "success",
      })

      setTimeout(() => {
        onClose()
        onSuccess()
      }, 1000)
    } catch (error) {
      console.error("Erro:", error)
      setAlert({
        show: true,
        message: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} cliente.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Formatar CPF para exibição
  const formatCpf = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return cleaned
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Cliente" : "Novo Cliente"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formatCpf(formData.cpf)}
              onChange={handleCpfChange}
              placeholder="CPF"
              required
              maxLength={14}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={formData.data_nascimento}
              onChange={handleChange}
              required
            />
          </div>

          {isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="saldo_restante">Saldo</Label>
                <Input
                  id="saldo_restante"
                  name="saldo_restante"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.saldo_restante}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="ativo" checked={formData.ativo} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="ativo">Ativo</Label>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Modal>

      <AlertNotification
        isVisible={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </>
  )
}
