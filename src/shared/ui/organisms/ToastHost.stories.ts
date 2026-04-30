import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToastHost from './ToastHost.vue'
import BaseButton from '../atoms/BaseButton.vue'
import { useToast } from '@/shared/lib/toast'

const meta = {
  title: 'UI/Organisms/ToastHost',
  component: ToastHost,
} satisfies Meta<typeof ToastHost>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => ({
    components: { ToastHost, BaseButton },
    setup: () => {
      const toast = useToast()
      const pushInfo = () => toast.info('Bilgilendirme mesaji')
      const pushSuccess = () => toast.success('Islem basarili')
      const pushError = () => toast.error('Bir hata olustu')
      return { pushInfo, pushSuccess, pushError }
    },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <BaseButton size="sm" variant="secondary" @click="pushInfo">Info</BaseButton>
        <BaseButton size="sm" @click="pushSuccess">Success</BaseButton>
        <BaseButton size="sm" variant="ghost" @click="pushError">Error</BaseButton>
      </div>
      <ToastHost />
    `,
  }),
}

