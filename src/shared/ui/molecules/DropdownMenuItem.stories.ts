import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DropdownMenuItem from './DropdownMenuItem.vue'

const meta = {
  title: 'UI/Molecules/DropdownMenuItem',
  component: DropdownMenuItem,
  args: {
    label: 'E-posta gonder',
    icon: 'mail',
    tone: 'default',
    disabled: false,
  },
} satisfies Meta<typeof DropdownMenuItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Danger: Story = {
  args: {
    label: 'Sil',
    icon: 'trash',
    tone: 'danger',
  },
}

