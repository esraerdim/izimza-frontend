import type { Meta, StoryObj } from '@storybook/vue3-vite'
import EmptyState from './EmptyState.vue'
import BaseButton from '../atoms/BaseButton.vue'

const meta = {
  title: 'UI/Molecules/EmptyState',
  component: EmptyState,
  args: {
    icon: 'inbox',
    title: 'Belge bulunamadi',
    description: 'Filtreleri temizleyip tekrar deneyin.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  render: (args) => ({
    components: { EmptyState, BaseButton },
    setup: () => ({ args }),
    template: `
      <EmptyState v-bind="args">
        <template #actions>
          <BaseButton size="sm">Yenile</BaseButton>
        </template>
      </EmptyState>
    `,
  }),
}

