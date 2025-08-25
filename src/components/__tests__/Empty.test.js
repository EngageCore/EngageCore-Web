import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Empty from '../Empty.vue'

describe('Empty Component', () => {
  it('renders properly', () => {
    const wrapper = mount(Empty)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct text', () => {
    const wrapper = mount(Empty)
    expect(wrapper.text()).toContain('empty')
  })
})