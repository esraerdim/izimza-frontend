import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import '../src/app/styles/global.css'
import '../src/shared/config/design-tokens.css'
import { i18n } from '../src/app/providers/i18n'

setup((app) => {
  app.use(i18n)
})

const preview: Preview = {
  parameters: {
    viewMode: 'story',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview