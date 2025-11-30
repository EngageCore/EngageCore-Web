import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useCallApi } from '@/hooks/useCallApi'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    id: '',
    first_name: '',
    last_name: '',
    percentage_to_next_tier: 0,
    points_to_next_tier: 0
  })

  const userToken = ref(localStorage.getItem('userToken') || '')
  const isAuthenticated = computed(() => userToken.value !== '')

  const userInfo = computed(() => user)

  const login = async (memberID, slug) => {
    const { callApi } = useCallApi()
    const resp = await callApi('/member/login', 'POST', { memberID, slug })

    if (resp) {
      userToken.value = resp.access_token
      localStorage.setItem('userToken', resp.access_token)
    }
  }

  const setUserInfo = (userInfoData) => {
    Object.assign(user, userInfoData)
  }

  const logout = () => {
    Object.keys(user).forEach(key => {
      user[key] = ''
    })
    userToken.value = ''
    localStorage.removeItem('userToken')
  }

  return {
    userInfo,
    isAuthenticated,
    login,
    setUserInfo,
    logout
  }
})
