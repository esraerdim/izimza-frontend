import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCard from './BaseCard.vue'

const meta = {
  title: 'UI/Molecules/BaseCard',
  component: BaseCard,
  args: {
    padding: 'md',
    as: 'section',
    ariaLabel: 'Kart',
  },
  render: (args) => ({
    components: { BaseCard },
    setup: () => ({ args }),
    template: `
      <BaseCard v-bind="args">
        <h3 style="margin:0">Kart basligi</h3>
        <p style="margin:0;color:var(--color-text-secondary)">Icerik alani</p>
      </BaseCard>
    `,
  }),
} satisfies Meta<typeof BaseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LargePadding: Story = {
  args: { padding: 'lg' },
}

