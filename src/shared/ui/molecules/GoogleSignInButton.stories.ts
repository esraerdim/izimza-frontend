import type { Meta, StoryObj } from '@storybook/vue3-vite'
import GoogleSignInButton from './GoogleSignInButton.vue'

const meta = {
  title: 'UI/Molecules/GoogleSignInButton',
  component: GoogleSignInButton,
  args: {
    label: 'Google ile giris yap',
    disabled: false,
  },
} satisfies Meta<typeof GoogleSignInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

