import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ConfettiBurst from './ConfettiBurst.vue'

const meta = {
  title: 'UI/Molecules/ConfettiBurst',
  component: ConfettiBurst,
  args: {
    count: 18,
  },
} satisfies Meta<typeof ConfettiBurst>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { ConfettiBurst },
    setup: () => ({ args }),
    template: `
      <div style="position:relative;height:220px;border:1px solid var(--color-border-soft);border-radius:12px;overflow:hidden">
        <ConfettiBurst v-bind="args" />
      </div>
    `,
  }),
}

