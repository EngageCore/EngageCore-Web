import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = reactive({
    id: '',
    first_name: '',
    last_name: '',
    percentage_to_next_tier: 0,
    points_to_next_tier: 0
  })

  const isAuthenticated = ref(false)

  // Getters
  const userInfo = computed(() => user)

  // Actions
  const setUserInfo = (userInfoData) => {
    Object.assign(user, userInfoData)
  }

  const logout = () => {
    Object.keys(user).forEach(key => {
      user[key] = ''
    })
  }

  return {
    userInfo,
    setUserInfo,
    logout
  }
})
