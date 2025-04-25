import * as XLSX from "xlsx"

export function exportToExcel(data: any[], fileName: string, sheetName = "Sheet1") {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

export function formatOperacoesForExcel(operacoes: any[]) {
  return operacoes.map((op) => ({
    ID: op.operacao_id,
    Data: new Date(op.data_operacao).toLocaleString("pt-BR"),
    Cliente: op.cliente?.nome || "N/A",
    "CPF Cliente": op.cliente?.cpf || "N/A",
    Bebida: op.bebida?.nome || "N/A",
    "Preço Bebida": op.bebida?.preco ? `R$ ${op.bebida.preco.toFixed(2)}` : "N/A",
    Máquina: op.maquina?.nome || "N/A",
    "Código NFC": op.copo?.codigo_nfc || "N/A",
    "Valor Gasto": `R$ ${op.saldo_gasto.toFixed(2)}`,
  }))
}
