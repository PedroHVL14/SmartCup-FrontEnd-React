"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { AlertNotification } from "@/components/ui/alert-notification"

interface CopoFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  copo?: any
  isEditing?: boolean
}

export function CopoForm({ isOpen, onClose, onSuccess, copo, isEditing = false }: CopoFormProps) {
  const [formData, setFormData] = useState({
    capacidade: copo?.capacidade || 500,
    codigo_nfc: copo?.codigo_nfc || "",
    permite_alcool: copo?.permite_alcool !== undefined ? copo.permite_alcool : false,
    cliente_id: copo?.cliente?.id || null,
    ativo: copo?.ativo !== undefined ? copo.ativo : true,
  })
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true)
      try {
        const response = await fetch("https://smartcupapi.onrender.com/cliente")
        if (response.ok) {
          const data = await response.json()
          // Filtrar apenas clientes ativos
          setClientes(data.resultado.filter((cliente: any) => cliente.ativo))
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error)
      } finally {
        setLoadingClientes(false)
      }
    }

    if (isOpen) {
      fetchClientes()
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cliente_id: value ? Number.parseInt(value) : null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = "https://smartcupapi.onrender.com/copo"
      let method = "POST"
      let submitData: any = {
        capacidade: Number.parseFloat(formData.capacidade.toString()),
        codigo_nfc: formData.codigo_nfc,
        permite_alcool: formData.permite_alcool,
        cliente_id: formData.cliente_id,
      }

      if (isEditing) {
        url = `${url}/${copo.id}`
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
        throw new Error("Erro ao salvar copo")
      }

      setAlert({
        show: true,
        message: `Copo ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`,
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
        message: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} copo.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Copo" : "Novo Copo"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo_nfc">Código NFC</Label>
            <Input
              id="codigo_nfc"
              name="codigo_nfc"
              value={formData.codigo_nfc}
              onChange={handleChange}
              placeholder="Código NFC do copo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade (ml)</Label>
            <Input
              id="capacidade"
              name="capacidade"
              type="number"
              min="1"
              value={formData.capacidade}
              onChange={handleChange}
              placeholder="Capacidade em ml"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente_id">Cliente</Label>
            <Select value={formData.cliente_id?.toString() || ""} onValueChange={handleSelectChange}>
              <SelectTrigger id="cliente_id" className="w-full">
                <SelectValue placeholder="Selecione um cliente (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum cliente</SelectItem>
                {loadingClientes ? (
                  <SelectItem value="loading" disabled>
                    Carregando clientes...
                  </SelectItem>
                ) : (
                  clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="permite_alcool"
              checked={formData.permite_alcool}
              onCheckedChange={(checked) => handleSwitchChange("permite_alcool", checked)}
            />
            <Label htmlFor="permite_alcool">Permite Bebidas Alcoólicas</Label>
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
