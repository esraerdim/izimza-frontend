import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FormField from './FormField.vue'
import BaseInput from '../atoms/BaseInput.vue'

const meta = {
  title: 'UI/Molecules/FormField',
  component: FormField,
  args: {
    label: 'E-posta',
    hint: 'Kurumsal e-posta girin',
    error: '',
  },
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const WithHint: Story = {
  render: (args) => ({
    components: { FormField, BaseInput },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: `
      <FormField v-bind="args">
        <BaseInput v-model="value" placeholder="demo@izimza.com" />
      </FormField>
    `,
  }),
}

export const WithError: Story = {
  args: {
    error: 'Bu alan zorunludur',
    hint: '',
  },
  render: (args) => ({
    components: { FormField, BaseInput },
    setup: () => {
      const value = ref('')
      return { args, value }
    },
    template: `
      <FormField v-bind="args">
        <BaseInput v-model="value" aria-invalid />
      </FormField>
    `,
  }),
}

