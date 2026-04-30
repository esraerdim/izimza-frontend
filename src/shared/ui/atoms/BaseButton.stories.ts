import BaseButton from './BaseButton.vue'

type BaseButtonStoryArgs = {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md'
  disabled: boolean
  fullWidth: boolean
}

export default {
  title: 'UI/Atoms/BaseButton',
  component: BaseButton,
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
  },
  render: (args: BaseButtonStoryArgs) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: '<BaseButton v-bind="args">Buton</BaseButton>',
  }),
}

export const Primary = {}

export const Secondary = {
  args: { variant: 'secondary' },
}

export const Ghost = {
  args: { variant: 'ghost' },
}

export const Disabled = {
  args: { disabled: true },
}

