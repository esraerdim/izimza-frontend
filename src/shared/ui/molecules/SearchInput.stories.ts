import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SearchInput from './SearchInput.vue'

const meta = {
  title: 'UI/Molecules/SearchInput',
  component: SearchInput,
  args: {
    modelValue: '',
    placeholder: 'Belge ara',
    disabled: false,
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { SearchInput },
    setup: () => {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: '<SearchInput v-bind="args" v-model="value" />',
  }),
}

