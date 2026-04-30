import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSpinner from './BaseSpinner.vue'

const meta = {
  title: 'UI/Atoms/BaseSpinner',
  component: BaseSpinner,
  args: {
    size: 24,
    label: 'Yukleniyor',
  },
} satisfies Meta<typeof BaseSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Large: Story = {
  args: {
    size: 40,
  },
}

