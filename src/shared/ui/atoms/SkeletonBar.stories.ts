import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SkeletonBar from './SkeletonBar.vue'

const meta = {
  title: 'UI/Atoms/SkeletonBar',
  component: SkeletonBar,
  args: {
    width: '220px',
    height: '12px',
    radius: '6px',
  },
} satisfies Meta<typeof SkeletonBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CardRow: Story = {
  render: (args) => ({
    components: { SkeletonBar },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:8px;max-width:300px">
        <SkeletonBar v-bind="args" />
        <SkeletonBar width="180px" height="10px" />
        <SkeletonBar width="120px" height="10px" />
      </div>
    `,
  }),
}

