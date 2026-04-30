import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

type BaseInputStoryArgs = {
  modelValue: string
  placeholder: string
  type: string
  disabled: boolean
  ariaInvalid: boolean
}

export default {
  title: 'UI/Atoms/BaseInput',
  component: BaseInput,
  args: {
    modelValue: '',
    placeholder: 'ornek@izimza.com',
    type: 'text',
    disabled: false,
    ariaInvalid: false,
  },
  render: (args: BaseInputStoryArgs) => ({
    components: { BaseInput },
    setup: () => {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: '<BaseInput v-bind="args" v-model="value" />',
  }),
}

export const Default = {}

export const Invalid = {
  args: { ariaInvalid: true, modelValue: 'hata' },
}

export const Disabled = {
  args: { disabled: true, modelValue: 'devre disi' },
}

