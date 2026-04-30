import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('renders the title and description', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No items', description: 'Try uploading a file.' },
    })
    expect(wrapper.text()).toContain('No items')
    expect(wrapper.text()).toContain('Try uploading a file.')
  })

  it('renders the actions slot when provided', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Empty' },
      slots: { actions: '<button>Reload</button>' },
    })
    expect(wrapper.find('button').text()).toBe('Reload')
  })
})
