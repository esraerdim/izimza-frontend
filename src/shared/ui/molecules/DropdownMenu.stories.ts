import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import IconButton from '../atoms/IconButton.vue'

const meta = {
  title: 'UI/Molecules/DropdownMenu',
  component: DropdownMenu,
  args: {
    open: false,
    align: 'right',
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: (args) => ({
    components: { DropdownMenu, DropdownMenuItem, IconButton },
    setup: () => {
      const open = ref(args.open)
      return { args, open }
    },
    template: `
      <DropdownMenu :open="open" :align="args.align" @close="open = false">
        <template #trigger>
          <IconButton icon="menu-dots" label="Menu" @click="open = !open" />
        </template>
        <DropdownMenuItem label="E-posta gonder" icon="mail" @select="open = false" />
        <DropdownMenuItem label="Sil" icon="trash" tone="danger" @select="open = false" />
      </DropdownMenu>
    `,
  }),
}

