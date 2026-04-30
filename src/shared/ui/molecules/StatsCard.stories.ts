import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatsCard from './StatsCard.vue'

const meta = {
  title: 'UI/Molecules/StatsCard',
  component: StatsCard,
  args: {
    title: 'Toplam Imza',
    value: 128,
    subtitle: 'Bu ay',
    trendText: '+12%',
    variant: 'metric-brand',
    icon: 'sign',
  },
} satisfies Meta<typeof StatsCard>

export default meta
type Story = StoryObj<typeof meta>

export const Brand: Story = {}

export const Coral: Story = {
  args: {
    title: 'Zaman Damgasi',
    value: 44,
    subtitle: 'Son 30 gun',
    trendText: '+4%',
    variant: 'metric-coral',
    icon: 'stamp',
  },
}
