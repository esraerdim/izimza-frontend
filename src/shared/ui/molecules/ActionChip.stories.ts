import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionChip from './ActionChip.vue'

const meta = {
  title: 'UI/Molecules/ActionChip',
  component: ActionChip,
  args: {
    label: 'Imzala',
    icon: 'sign',
  },
} satisfies Meta<typeof ActionChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Timestamp: Story = {
  args: {
    label: 'Zaman Damgala',
    icon: 'stamp',
  },
}

