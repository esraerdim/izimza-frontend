import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Save' } })
    expect(wrapper.text()).toBe('Save')
  })

  it('applies the variant + size class names', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary', size: 'sm' },
      slots: { default: 'X' },
    })
    expect(wrapper.classes()).toContain('base-button--secondary')
    expect(wrapper.classes()).toContain('base-button--sm')
  })

  it('respects the disabled attribute', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'X' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click when activated', async () => {
    const wrapper = mount(BaseButton, { slots: { default: 'X' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
