import type { Meta, StoryObj } from '@storybook/vue3-vite'
import IconButton from './IconButton.vue'

const meta = {
  title: 'UI/Atoms/IconButton',
  component: IconButton,
  args: {
    icon: 'menu-dots',
    label: 'Aksiyonlar',
    variant: 'ghost',
    disabled: false,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Ghost: Story = {}

export const Soft: Story = {
  args: { variant: 'soft', icon: 'download', label: 'Indir' },
}

export const Danger: Story = {
  args: { variant: 'danger', icon: 'trash', label: 'Sil' },
}

