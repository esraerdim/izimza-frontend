import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DocumentsTable from './DocumentsTable.vue'

type DocumentRow = {
  id: number
  name: string
  sizeMb: number
  action: string
  createdAt: string
  previewUrl?: string
}

const labels = {
  file: 'Dosya',
  date: 'Tarih',
  action: 'Islem',
  viewAction: 'Goruntule',
  downloadAction: 'Indir',
  otherActions: 'Diger islemler',
  emailSend: 'E-posta gonder',
  delete: 'Sil',
  emptyTitle: 'Kayit yok',
  emptyDescription: 'Henuz belge bulunmuyor.',
}

const sampleDocs: DocumentRow[] = [
  {
    id: 1,
    name: 'sozlesme.pdf',
    sizeMb: 1.2,
    action: 'signed',
    createdAt: '2026-04-30T11:00:00.000Z',
    previewUrl: '/mock-files/sample.pdf',
  },
  {
    id: 2,
    name: 'teslim_tutanagi.pdf',
    sizeMb: 0.8,
    action: 'stamp',
    createdAt: '2026-04-30T13:00:00.000Z',
    previewUrl: '/mock-files/sample2.pdf',
  },
]

const meta = {
  title: 'UI/Organisms/DocumentsTable',
  component: DocumentsTable,
  args: {
    documents: sampleDocs,
    labels,
    formatDate: (value: string) => new Date(value).toLocaleDateString('tr-TR'),
    actionLabel: (action: string) => action,
    actionTone: (action: string) => action,
    isLoading: false,
  },
} satisfies Meta<typeof DocumentsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { documents: [] },
}

export const Loading: Story = {
  args: {
    documents: [],
    isLoading: true,
    skeletonRows: 3,
  },
}
