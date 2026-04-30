import { downloadFromUrl } from './url'

const escapeCsvCell = (value: string | number) => {
  const normalized = String(value).replaceAll('"', '""')
  return `"${normalized}"`
}

export const exportCsvFile = (
  headers: string[],
  rows: Array<Array<string | number>>,
  fileName: string,
) => {
  const csvLines = [headers, ...rows].map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  downloadFromUrl(url, fileName)
  URL.revokeObjectURL(url)
}
