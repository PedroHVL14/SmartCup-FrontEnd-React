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

interface MaquinaFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  maquina?: any
  isEditing?: boolean
}

export function MaquinaForm({ isOpen, onClose, onSuccess, maquina, isEditing = false }: MaquinaFormProps) {
  const [formData, setFormData] = useState({
    nome: maquina?.nome || "",
    qtd_reservatorio_max: maquina?.qtd_reservatorio_max || 5000,
    qtd_reservatorio_atual: maquina?.qtd_reservatorio_atual || 0,
    bebida_id: maquina?.bebida?.id || null,
    ativo: maquina?.ativo !== undefined ? maquina.ativo : true,
  })
  const [bebidas, setBebidas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingBebidas, setLoadingBebidas] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" as "success" | "error" })

  useEffect(() => {
    const fetchBebidas = async () => {
      setLoadingBebidas(true)
      try {
        const response = await fetch("https://smartcupapi.onrender.com/bebida")
        if (response.ok) {
          const data = await response.json()
          // Filtrar apenas bebidas ativas
          setBebidas(data.resultado.filter((bebida: any) => bebida.ativo))
        }
      } catch (error) {
        console.error("Erro ao buscar bebidas:", error)
      } finally {
        setLoadingBebidas(false)
      }
    }

    if (isOpen) {
      fetchBebidas()
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, ativo: checked }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bebida_id: value ? Number.parseInt(value) : null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url = "https://smartcupapi.onrender.com/maquina"
      let method = "POST"
      const submitData: any = {
        nome: formData.nome,
        qtd_reservatorio_max: Number.parseFloat(formData.qtd_reservatorio_max.toString()),
        qtd_reservatorio_atual: Number.parseFloat(formData.qtd_reservatorio_atual.toString()),
        bebida_id: formData.bebida_id,
        ativo: formData.ativo,
      }

      if (isEditing) {
        url = `${url}/${maquina.id}`
        method = "PATCH"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar máquina")
      }

      setAlert({
        show: true,
        message: `Máquina ${isEditing ? "atualizada" : "cadastrada"} com sucesso!`,
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
        message: `Erro ao ${isEditing ? "atualizar" : "cadastrar"} máquina.`,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Máquina" : "Nova Máquina"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome da máquina"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bebida_id">Bebida</Label>
            <Select value={formData.bebida_id?.toString() || ""} onValueChange={handleSelectChange}>
              <SelectTrigger id="bebida_id" className="w-full">
                <SelectValue placeholder="Selecione uma bebida" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma bebida</SelectItem>
                {loadingBebidas ? (
                  <SelectItem value="loading" disabled>
                    Carregando bebidas...
                  </SelectItem>
                ) : (
                  bebidas.map((bebida) => (
                    <SelectItem key={bebida.id} value={bebida.id.toString()}>
                      {bebida.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qtd_reservatorio_max">Capacidade Máxima (ml)</Label>
            <Input
              id="qtd_reservatorio_max"
              name="qtd_reservatorio_max"
              type="number"
              min="1"
              value={formData.qtd_reservatorio_max}
              onChange={handleChange}
              placeholder="Capacidade máxima em ml"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qtd_reservatorio_atual">Quantidade Atual (ml)</Label>
            <Input
              id="qtd_reservatorio_atual"
              name="qtd_reservatorio_atual"
              type="number"
              min="0"
              max={formData.qtd_reservatorio_max}
              value={formData.qtd_reservatorio_atual}
              onChange={handleChange}
              placeholder="Quantidade atual em ml"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ativo" checked={formData.ativo} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="ativo">Ativo</Label>
          </div>

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
