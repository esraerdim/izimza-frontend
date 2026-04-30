import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Icon from './Icon.vue'

const iconNames = [
  'home',
  'sign',
  'stamp',
  'archive',
  'search',
  'mail',
  'trash',
  'check',
  'close',
] as const

const meta = {
  title: 'UI/Atoms/Icon',
  component: Icon,
  args: {
    name: 'home',
    size: 20,
    strokeWidth: 1.7,
    decorative: true,
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Gallery: Story = {
  render: () => ({
    components: { Icon },
    setup: () => ({ iconNames }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:360px">
        <div v-for="name in iconNames" :key="name" style="display:flex;gap:8px;align-items:center">
          <Icon :name="name" :size="20" />
          <span style="font-size:12px">{{ name }}</span>
        </div>
      </div>
    `,
  }),
}

