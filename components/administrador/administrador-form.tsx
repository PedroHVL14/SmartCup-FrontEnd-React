"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import { AlertNotification } from "@/components/ui/alert-notification"

interface AdministradorFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  administrador?: any
  isEditing?: boolean
}

export function AdministradorForm({
  isOpen,
  onClose,
  onSuccess,
  administrador,
  isEditing = false,
}: AdministradorFormProps) {
  const [formData, setFormData] = useState({
    nome: administrador?.nome || "",
    login: administrador?.login || "",
    senha: "",
    ativo: administrador?.ativo !== undefined ? administrador.ativo : true,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = "https://smartcupapi.onrender.com/administrador"
      let method = "POST"
      let submitData = { nome: formData.nome, login: formData.login, senha: formData.senha }

      if (isEditing) {
        url = `${url}/${administrador.id}`
        method = "PATCH"
        submitData = {
          ...submitData,
          ativo: formData.ativo,
        }

        // Se a senha estiver vazia, não a envie na atualização
        if (!formData.senha) {
          delete submitData.senha
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
        throw new Error("Erro ao salvar administrador")
      }

      setAlert({
        show: true,
        message: `Administrador ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`,
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
        message: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} administrador.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Administrador" : "Novo Administrador"}>
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
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Nome de usuário"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha {isEditing && "(deixe em branco para manter a atual)"}</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Senha"
              required={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch id="ativo" checked={formData.ativo} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="ativo">Ativo</Label>
            </div>
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
