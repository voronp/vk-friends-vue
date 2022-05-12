import { shallowMount } from '@vue/test-utils'
import BaseUserCard from '@/components/BaseUserCard.vue'

describe('BaseUserCard.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'new title'
    const wrapper = shallowMount(BaseUserCard, {
      props: { title }
    })
    expect(wrapper.find('[data-test="title"]').text()).toMatch(title)
  })
})
