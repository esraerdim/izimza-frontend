import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseModal from './BaseModal.vue'
import BaseButton from '../atoms/BaseButton.vue'

const meta = {
  title: 'UI/Molecules/BaseModal',
  component: BaseModal,
  args: {
    open: false,
    closeOnBackdrop: true,
    closeOnEscape: true,
    ariaLabel: 'Ornek modal',
  },
} satisfies Meta<typeof BaseModal>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: (args) => ({
    components: { BaseModal, BaseButton },
    setup: () => {
      const open = ref(args.open)
      return { args, open }
    },
    template: `
      <div>
        <BaseButton @click="open = true">Modal Ac</BaseButton>
        <BaseModal v-bind="args" :open="open" @close="open = false">
          <div style="padding:20px;display:flex;flex-direction:column;gap:12px">
            <h3 style="margin:0">Ornek Modal</h3>
            <p style="margin:0;color:var(--color-text-secondary)">Dialog davranisini test etmek icin.</p>
            <div style="display:flex;justify-content:flex-end;gap:8px">
              <BaseButton variant="secondary" @click="open = false">Vazgec</BaseButton>
              <BaseButton @click="open = false">Tamam</BaseButton>
            </div>
          </div>
        </BaseModal>
      </div>
    `,
  }),
}

