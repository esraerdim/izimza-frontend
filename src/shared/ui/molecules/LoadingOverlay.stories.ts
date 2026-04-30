import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LoadingOverlay from './LoadingOverlay.vue'
import BaseButton from '../atoms/BaseButton.vue'

const meta = {
  title: 'UI/Molecules/LoadingOverlay',
  component: LoadingOverlay,
  args: {
    visible: true,
    label: 'Yukleniyor...',
  },
} satisfies Meta<typeof LoadingOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { LoadingOverlay },
    setup: () => ({ args }),
    template: `
      <div style="position:relative;height:180px;border:1px solid var(--color-border-soft);border-radius:12px">
        <LoadingOverlay v-bind="args" />
      </div>
    `,
  }),
}

export const Interactive: Story = {
  render: (args) => ({
    components: { LoadingOverlay, BaseButton },
    setup: () => {
      const visible = ref(args.visible)
      return { args, visible }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;max-width:420px">
        <BaseButton size="sm" @click="visible = !visible">Toggle overlay</BaseButton>
        <div style="position:relative;height:180px;border:1px solid var(--color-border-soft);border-radius:12px">
          <LoadingOverlay :visible="visible" :label="args.label" />
        </div>
      </div>
    `,
  }),
}

