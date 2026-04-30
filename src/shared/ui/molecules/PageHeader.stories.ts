import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PageHeader from './PageHeader.vue'
import BaseButton from '../atoms/BaseButton.vue'

const meta = {
  title: 'UI/Molecules/PageHeader',
  component: PageHeader,
  args: {
    kicker: 'Panel',
    title: 'Dashboard',
    subtitle: 'Bugunku ozet',
    variant: 'default',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithActions: Story = {
  render: (args) => ({
    components: { PageHeader, BaseButton },
    setup: () => ({ args }),
    template: `
      <PageHeader v-bind="args">
        <template #actions>
          <BaseButton variant="secondary" size="sm">Filtrele</BaseButton>
          <BaseButton size="sm">Yeni</BaseButton>
        </template>
      </PageHeader>
    `,
  }),
}

