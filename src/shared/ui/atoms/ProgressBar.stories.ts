import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ProgressBar from './ProgressBar.vue'

const meta = {
  title: 'UI/Atoms/ProgressBar',
  component: ProgressBar,
  args: {
    value: 40,
    max: 100,
    tone: 'brand',
    label: 'Yukleme',
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Brand: Story = {}

export const Success: Story = {
  args: { value: 75, tone: 'success' },
}

export const Danger: Story = {
  args: { value: 20, tone: 'danger' },
}

