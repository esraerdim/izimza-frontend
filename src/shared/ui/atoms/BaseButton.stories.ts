import BaseButton from './BaseButton.vue'

export default {
  title: 'UI/Atoms/BaseButton',
  component: BaseButton,
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
  },
  render: (args) => ({
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

