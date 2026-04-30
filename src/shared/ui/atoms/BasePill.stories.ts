import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BasePill from './BasePill.vue'

const tones = ['brand', 'neutral', 'success', 'warning', 'danger', 'sage', 'coral', 'amber'] as const

const meta = {
  title: 'UI/Atoms/BasePill',
  component: BasePill,
  args: { tone: 'brand' },
  render: (args) => ({
    components: { BasePill },
    setup: () => ({ args }),
    template: '<BasePill v-bind="args">Durum</BasePill>',
  }),
} satisfies Meta<typeof BasePill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllTones: Story = {
  render: () => ({
    components: { BasePill },
    setup: () => ({ tones }),
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <BasePill v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</BasePill>
      </div>
    `,
  }),
}

