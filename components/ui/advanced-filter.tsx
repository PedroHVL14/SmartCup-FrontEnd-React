"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterOption {
  id: string
  label: string
  type: "text" | "select" | "date" | "boolean" | "number"
  options?: { value: string; label: string }[]
}

interface AdvancedFilterProps {
  filters: FilterOption[]
  onFilterChange: (filters: Record<string, any>) => void
  activeFilters: Record<string, any>
  className?: string
}

export function AdvancedFilter({ filters, onFilterChange, activeFilters, className }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...activeFilters }

    if (value === undefined || value === "" || value === null) {
      delete newFilters[id]
    } else {
      newFilters[id] = value
    }

    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    onFilterChange({})
    setIsOpen(false)
  }

  const activeFilterCount = Object.keys(activeFilters).length

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge className="ml-1 bg-blue-600 text-white rounded-full h-5 min-w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtros Avançados</h4>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-sm text-gray-500">
                  Limpar todos
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <Label htmlFor={filter.id}>{filter.label}</Label>

                  {filter.type === "text" && (
                    <Input
                      id={filter.id}
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      placeholder={`Filtrar por ${filter.label.toLowerCase()}`}
                    />
                  )}

                  {filter.type === "select" && (
                    <Select
                      value={activeFilters[filter.id] || ""}
                      onValueChange={(value) => handleFilterChange(filter.id, value)}
                    >
                      <SelectTrigger id={filter.id}>
                        <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filter.type === "date" && (
                    <Input
                      id={filter.id}
                      type="date"
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    />
                  )}

                  {filter.type === "boolean" && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={filter.id}
                        checked={activeFilters[filter.id] || false}
                        onCheckedChange={(checked) => handleFilterChange(filter.id, checked)}
                      />
                      <Label htmlFor={filter.id}>Ativo</Label>
                    </div>
                  )}

                  {filter.type === "number" && (
                    <Input
                      id={filter.id}
                      type="number"
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value ? Number(e.target.value) : "")}
                      placeholder={`Filtrar por ${filter.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setIsOpen(false)}>Aplicar Filtros</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters).map(([key, value]) => {
          const filter = filters.find((f) => f.id === key)
          if (!filter) return null

          let displayValue = value

          if (filter.type === "select") {
            const option = filter.options?.find((o) => o.value === value)
            displayValue = option?.label || value
          } else if (filter.type === "boolean") {
            displayValue = value ? "Sim" : "Não"
          }

          return (
            <Badge key={key} variant="secondary" className="px-2 py-1 gap-1">
              {filter.label}: {displayValue}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleFilterChange(key, undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
