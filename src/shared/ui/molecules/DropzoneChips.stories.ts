import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DropzoneChips from './DropzoneChips.vue'

const meta = {
  title: 'UI/Molecules/DropzoneChips',
  component: DropzoneChips,
} satisfies Meta<typeof DropzoneChips>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

