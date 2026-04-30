import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FileUploadDropzone from './FileUploadDropzone.vue'

const meta = {
  title: 'UI/Molecules/FileUploadDropzone',
  component: FileUploadDropzone,
  args: {
    title: 'Dosyayi birakin veya secin',
    subtitle: 'PDF, DOCX, PNG',
    statusText: '',
    isLarge: false,
    isPulse: false,
    disabled: false,
  },
} satisfies Meta<typeof FileUploadDropzone>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargePulse: Story = {
  args: {
    isLarge: true,
    isPulse: true,
    statusText: 'Dosya bekleniyor...',
  },
}

