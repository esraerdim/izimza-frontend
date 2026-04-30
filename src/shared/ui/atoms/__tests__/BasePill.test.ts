import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePill from '../BasePill.vue'

describe('BasePill', () => {
  it('renders the slot content', () => {
    const wrapper = mount(BasePill, { slots: { default: 'Active' } })
    expect(wrapper.text()).toBe('Active')
  })

  it('defaults to brand tone', () => {
    const wrapper = mount(BasePill, { slots: { default: '!' } })
    expect(wrapper.classes()).toContain('base-pill--brand')
  })

  it('applies a custom tone', () => {
    const wrapper = mount(BasePill, { props: { tone: 'sage' }, slots: { default: '!' } })
    expect(wrapper.classes()).toContain('base-pill--sage')
  })
})
