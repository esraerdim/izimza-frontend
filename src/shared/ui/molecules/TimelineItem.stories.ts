import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TimelineItem from './TimelineItem.vue'

const meta = {
  title: 'UI/Molecules/TimelineItem',
  component: TimelineItem,
  args: {
    title: 'Belge imzalandi',
    subtitle: '2 dakika once',
    tone: 'brand',
  },
} satisfies Meta<typeof TimelineItem>

export default meta
type Story = StoryObj<typeof meta>

export const Brand: Story = {}

export const AllTones: Story = {
  render: () => ({
    components: { TimelineItem },
    template: `
      <ul style="margin:0;padding:0;max-width:360px">
        <TimelineItem title="Imza tamamlandi" subtitle="Az once" tone="brand" />
        <TimelineItem title="Paylasim yapildi" subtitle="Bugun" tone="sage" />
        <TimelineItem title="Zaman damgasi" subtitle="Dun" tone="coral" />
        <TimelineItem title="Bekliyor" subtitle="2 gun once" tone="amber" />
      </ul>
    `,
  }),
}

