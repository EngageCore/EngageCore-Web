<template>
  <header class="header">
    <!-- HEADER ACTIONS -->
    <div class="header-actions">
      <!-- HEADER BRAND -->
      <div class="header-brand">
        <!-- LOGO -->
        <div class="logo">
          <!-- ICON LOGO VIKINGER -->
          <svg class="icon-logo-vikinger small">
            <use xlink:href="#svg-logo-vikinger"></use>
          </svg>
          <!-- /ICON LOGO VIKINGER -->
        </div>
        <!-- /LOGO -->

        <!-- HEADER BRAND TEXT -->
        <h1 class="header-brand-text">Engage Core</h1>
        <!-- /HEADER BRAND TEXT -->
      </div>
      <!-- /HEADER BRAND -->
    </div>
    <!-- /HEADER ACTIONS -->

    <!-- HEADER ACTIONS -->
    <div class="header-actions">
      <!-- SIDEMENU TRIGGER -->
      <div class="sidemenu-trigger navigation-widget-trigger" @click="sidebar.toggle()">
        <!-- ICON GRID -->
        <svg class="icon-grid">
          <use xlink:href="#svg-grid"></use>
        </svg>
        <!-- /ICON GRID -->
      </div>
      <!-- /SIDEMENU TRIGGER -->

      <!-- MOBILEMENU TRIGGER -->
      <div class="mobilemenu-trigger navigation-widget-mobile-trigger" @click="toggleMobileMenu">
        <!-- BURGER ICON -->
        <div class="burger-icon inverted">
          <!-- BURGER ICON BAR -->
          <div class="burger-icon-bar"></div>
          <!-- /BURGER ICON BAR -->

          <!-- BURGER ICON BAR -->
          <div class="burger-icon-bar"></div>
          <!-- /BURGER ICON BAR -->

          <!-- BURGER ICON BAR -->
          <div class="burger-icon-bar"></div>
          <!-- /BURGER ICON BAR -->
        </div>
        <!-- /BURGER ICON -->
      </div>
      <!-- /MOBILEMENU TRIGGER -->

      <!-- NAVIGATION -->
      <nav class="navigation">
        <!-- MENU MAIN -->
        <ul class="menu-main">
          <!-- MENU MAIN ITEM -->
          <li v-for="item in menuItems" :key="item.title" class="menu-main-item"
            :class="{ active: route.path === item.path }">
            <!-- MENU MAIN ITEM LINK -->
            <a class="menu-main-item-link" @click="navigateTo(item.path)">

              {{ item.title }}
            </a>
            <!-- /MENU MAIN ITEM LINK -->
          </li>
          <!-- /MENU MAIN ITEM -->
        </ul>
        <!-- /MENU MAIN -->
      </nav>
      <!-- /NAVIGATION -->
    </div>
    <!-- /HEADER ACTIONS -->

    <!-- HEADER ACTIONS -->
    <div class="header-actions search-bar">
      <!-- INTERACTIVE INPUT -->
      <div class="interactive-input dark">
        <input type="text" id="search-main" name="search_main" placeholder="Search here for people or groups" disabled>
        <!-- INTERACTIVE INPUT ICON WRAP -->
        <div class="interactive-input-icon-wrap">
          <!-- INTERACTIVE INPUT ICON -->
          <svg class="interactive-input-icon icon-magnifying-glass">
            <use xlink:href="#svg-magnifying-glass"></use>
          </svg>
          <!-- /INTERACTIVE INPUT ICON -->
        </div>
        <!-- /INTERACTIVE INPUT ICON WRAP -->
      </div>
      <!-- /INTERACTIVE INPUT -->
    </div>
    <!-- /HEADER ACTIONS -->

    <!-- HEADER ACTIONS -->
     <div class="header-actions">
       <!-- ACTION LIST -->
       <div class="action-list dark">
         <!-- ACTION LIST ITEM WRAP -->
        <div class="action-list-item-wrap" style="position: relative;">
          <!-- ACTION LIST ITEM -->
          <div class="action-list-item unread header-dropdown-trigger" @click="toggleNotificationsDropdown">
            <!-- ACTION LIST ITEM ICON -->
            <svg class="action-list-item-icon icon-notification">
              <use xlink:href="#svg-notification"></use>
            </svg>
            <!-- /ACTION LIST ITEM ICON -->
          </div>
          <!-- /ACTION LIST ITEM -->

          <!-- DROPDOWN BOX -->
          <div class="dropdown-box header-dropdown" :style="{
            position: 'absolute',
            zIndex: 9999,
            top: '64px',
            right: '6px',
            opacity: showNotificationsDropdown ? 1 : 0,
            visibility: showNotificationsDropdown ? 'visible' : 'hidden',
            transform: showNotificationsDropdown ? 'translate(0px, 0px)' : 'translate(0px, -40px)',
            transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, visibility 0.4s ease-in-out'
          }">
            <!-- DROPDOWN BOX HEADER -->
            <div class="dropdown-box-header">
              <!-- DROPDOWN BOX HEADER TITLE -->
              <p class="dropdown-box-header-title">Notifications</p>
              <!-- /DROPDOWN BOX HEADER TITLE -->

              <!-- DROPDOWN BOX HEADER ACTIONS -->
              <div class="dropdown-box-header-actions">
                <!-- DROPDOWN BOX HEADER ACTION -->
                <p class="dropdown-box-header-action" @click="markAllAsRead">Mark all as Read</p>
                <!-- /DROPDOWN BOX HEADER ACTION -->

                <!-- DROPDOWN BOX HEADER ACTION -->
                <p class="dropdown-box-header-action">Settings</p>
                <!-- /DROPDOWN BOX HEADER ACTION -->
              </div>
              <!-- /DROPDOWN BOX HEADER ACTIONS -->
            </div>
            <!-- /DROPDOWN BOX HEADER -->

            <!-- DROPDOWN BOX LIST -->
            <div class="dropdown-box-list">
              <!-- DROPDOWN BOX LIST ITEM -->
              <div class="dropdown-box-list-item" :class="{ unread: notification.unread }"
                v-for="notification in notifications || []" :key="notification.id">
                <!-- USER STATUS -->
                <div class="user-status notification">
                  <!-- USER STATUS AVATAR -->
                  <div class="user-status-avatar">
                    <!-- USER AVATAR -->
                    <div class="user-avatar small no-outline">
                      <!-- USER AVATAR CONTENT -->
                      <div class="user-avatar-content">
                        <!-- HEXAGON -->
                        <div class="hexagon-image-30-32" :data-src="notification.avatar"
                          style="width: 30px; height: 32px; position: relative;">
                          <canvas width="30" height="32" style="position: absolute; top: 0px; left: 0px;"></canvas>
                        </div>
                        <!-- /HEXAGON -->
                      </div>
                      <!-- /USER AVATAR CONTENT -->
                    </div>
                    <!-- /USER AVATAR -->
                  </div>
                  <!-- /USER STATUS AVATAR -->

                  <!-- USER STATUS TITLE -->
                  <p class="user-status-title">{{ notification.title }}</p>
                  <!-- /USER STATUS TITLE -->

                  <!-- USER STATUS TIMESTAMP -->
                  <p class="user-status-timestamp">{{ notification.timestamp }}</p>
                  <!-- /USER STATUS TIMESTAMP -->

                  <!-- USER STATUS ICON -->
                  <div class="user-status-icon">
                    <!-- ICON COMMENT -->
                    <svg class="icon-comment">
                      <use xlink:href="#svg-comment"></use>
                    </svg>
                    <!-- /ICON COMMENT -->
                  </div>
                  <!-- /USER STATUS ICON -->
                </div>
                <!-- /USER STATUS -->
              </div>
              <!-- /DROPDOWN BOX LIST ITEM -->
            </div>
            <!-- /DROPDOWN BOX LIST -->

            <!-- DROPDOWN BOX BUTTON -->
            <a class="dropdown-box-button secondary" href="#">View all Notifications</a>
            <!-- /DROPDOWN BOX BUTTON -->
          </div>
          <!-- /DROPDOWN BOX -->
        </div>
        <!-- /ACTION LIST ITEM WRAP -->
      </div>
      <!-- /ACTION LIST -->

      <!-- ACTION ITEM WRAP -->
      <div class="action-item-wrap" style="position: relative;">
        <!-- ACTION ITEM -->
        <div class="action-item dark header-settings-dropdown-trigger" @click="toggleSettingsDropdown">
          <!-- ACTION ITEM ICON -->
          <svg class="action-item-icon icon-settings">
            <use xlink:href="#svg-settings"></use>
          </svg>
          <!-- /ACTION ITEM ICON -->
        </div>
        <!-- /ACTION ITEM -->

        <!-- DROPDOWN NAVIGATION -->
        <div class="dropdown-navigation header-settings-dropdown" :style="{
          position: 'absolute',
          zIndex: 9999,
          top: '64px',
          right: '22px',
          opacity: showSettingsDropdown ? 1 : 0,
          visibility: showSettingsDropdown ? 'visible' : 'hidden',
          transform: showSettingsDropdown ? 'translate(0px, 0px)' : 'translate(0px, -40px)',
          transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, visibility 0.4s ease-in-out'
        }">
          <!-- DROPDOWN NAVIGATION HEADER -->
          <div class="dropdown-navigation-header">
            <!-- USER STATUS -->
            <div class="user-status">
              <!-- USER STATUS AVATAR -->
              <a class="user-status-avatar" href="#">
                <!-- USER AVATAR -->
                <div class="user-avatar small no-outline">
                  <!-- USER AVATAR CONTENT -->
                  <div class="user-avatar-content">
                    <!-- HEXAGON -->
                    <div class="hexagon-image-30-32" data-src="img/avatar/01.jpg"
                      style="width: 30px; height: 32px; position: relative;">
                      <canvas width="30" height="32" style="position: absolute; top: 0px; left: 0px;"></canvas>
                    </div>
                    <!-- /HEXAGON -->
                  </div>
                  <!-- /USER AVATAR CONTENT -->
                </div>
                <!-- /USER AVATAR -->
              </a>
              <!-- /USER STATUS AVATAR -->

              <!-- USER STATUS TITLE -->
              <p class="user-status-title"><span class="bold">Hi {{ currentUser.name }}!</span></p>
              <!-- /USER STATUS TITLE -->

              <!-- USER STATUS TEXT -->
              <p class="user-status-text small"><a href="#">@{{ currentUser.username }}</a></p>
              <!-- /USER STATUS TEXT -->
            </div>
            <!-- /USER STATUS -->
          </div>
          <!-- /DROPDOWN NAVIGATION HEADER -->

          <!-- DROPDOWN NAVIGATION CATEGORY -->
          <p class="dropdown-navigation-category">My Profile</p>
          <!-- /DROPDOWN NAVIGATION CATEGORY -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" @click="navigateTo('profile')">Profile Info</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">Social & Stream</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">Notifications</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">Messages</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION CATEGORY -->
          <p class="dropdown-navigation-category">Account</p>
          <!-- /DROPDOWN NAVIGATION CATEGORY -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">Account Info</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">Change Password</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION LINK -->
          <a class="dropdown-navigation-link" href="#">General Settings</a>
          <!-- /DROPDOWN NAVIGATION LINK -->

          <!-- DROPDOWN NAVIGATION BUTTON -->
          <p class="dropdown-navigation-button button small secondary" @click="logout">Logout</p>
          <!-- /DROPDOWN NAVIGATION BUTTON -->
        </div>
        <!-- /DROPDOWN NAVIGATION -->
      </div>
      <!-- /ACTION ITEM WRAP -->


    </div>
    <!-- /HEADER ACTIONS -->
  </header>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Router and stores
const router = useRouter()
const route = useRoute()
const sidebar = useSidebarStore()

// Reactive state
const showNotificationsDropdown = ref(false)
const showSettingsDropdown = ref(false)
const showMobileMenu = ref(false)

// Menu items from Sidebar.vue
const menuItems = [
  { title: 'Profile', path: '/profile', icon: 'overview' },
  { title: 'Wheel', path: '/wheel', icon: 'play' },
  { title: 'Missions', path: '/missions', icon: 'quests' },
  { title: 'History', path: '/history', icon: 'timeline' },
]

// Current user data
const currentUser = ref({
  name: 'Marina',
  username: 'marinavalentine',
  avatar: 'img/avatar/01.jpg'
})



// Mock notifications data
const notifications = ref([
  {
    id: 1,
    title: 'Nick Grissom posted a comment on your status update',
    timestamp: '2 minutes ago',
    avatar: 'img/avatar/03.jpg',
    unread: true
  },
  {
    id: 2,
    title: 'Sarah Johnson liked your photo',
    timestamp: '1 hour ago',
    avatar: 'img/avatar/07.jpg',
    unread: false
  },
  {
    id: 3,
    title: 'You have a new friend request',
    timestamp: '3 hours ago',
    avatar: 'img/avatar/08.jpg',
    unread: true
  }
])

// Navigation functions
const navigateTo = (routePath) => {
  router.push(routePath)
}

// Dropdown toggle functions
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleNotificationsDropdown = () => {
  showNotificationsDropdown.value = !showNotificationsDropdown.value
  // Close other dropdowns
  showSettingsDropdown.value = false
}

const toggleSettingsDropdown = () => {
  showSettingsDropdown.value = !showSettingsDropdown.value
  // Close other dropdowns
  showNotificationsDropdown.value = false
}

// Notification functions
const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.unread = false
  })
}

// User functions
const logout = () => {
  // Implement logout logic
  console.log('Logging out...')
  showSettingsDropdown.value = false
}

// Close dropdowns when clicking outside
const closeAllDropdowns = () => {
  showNotificationsDropdown.value = false
  showSettingsDropdown.value = false
  showMobileMenu.value = false
}

// Add click outside listener
if (typeof window !== 'undefined') {
  document.addEventListener('click', (event) => {
    const target = event.target
    if (!target.closest('.header')) {
      closeAllDropdowns()
    }
  })
}
</script>

<style scoped>
.sidebar-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  margin-right: 12px;
}

.sidebar-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.sidebar-toggle-btn .burger-icon {
  display: inline-grid;
  gap: 4px;
}

.sidebar-toggle-btn .burger-icon span {
  display: block;
  width: 18px;
  height: 2px;
  background: currentColor;
}
</style>
