import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    // true: 展开（显示大侧栏），false: 收起（显示小侧栏）
    isOpen: false,
  }),
  actions: {
    open() { this.isOpen = true },
    close() { this.isOpen = false },
    toggle() { this.isOpen = !this.isOpen },
  },
})