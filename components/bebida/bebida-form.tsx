"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import { AlertNotification } from "@/components/ui/alert-notification"

interface BebidaFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  bebida?: any
  isEditing?: boolean
}

export function BebidaForm({ isOpen, onClose, onSuccess, bebida, isEditing = false }: BebidaFormProps) {
  const [formData, setFormData] = useState({
    nome: bebida?.nome || "",
    preco: bebida?.preco !== undefined ? bebida.preco : "",
    alcolica: bebida?.alcolica !== undefined ? bebida.alcolica : false,
    descricao: bebida?.descricao || "",
    ativo: bebida?.ativo !== undefined ? bebida.ativo : true,
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = "https://smartcupapi.onrender.com/bebida"
      let method = "POST"
      let submitData: any = {
        nome: formData.nome,
        preco: Number.parseFloat(formData.preco.toString()),
        alcolica: formData.alcolica,
        descricao: formData.descricao,
      }

      if (isEditing) {
        url = `${url}/${bebida.id}`
        method = "PATCH"
        submitData = {
          ...submitData,
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
        throw new Error("Erro ao salvar bebida")
      }

      setAlert({
        show: true,
        message: `Bebida ${isEditing ? "atualizada" : "cadastrada"} com sucesso!`,
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
        message: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} bebida.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Bebida" : "Nova Bebida"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome da bebida"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição da bebida"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="alcolica"
              checked={formData.alcolica}
              onCheckedChange={(checked) => handleSwitchChange("alcolica", checked)}
            />
            <Label htmlFor="alcolica">Bebida Alcoólica</Label>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => handleSwitchChange("ativo", checked)}
              />
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
