import axios from 'axios';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
// import { useLoadingStore } from '@/store/loadingStore'; 
// import { useAuthStore } from '@/store/authStore'; 

export const useCallApi = () => {
  // const loadingStore = useLoadingStore();
  const userStore = useUserStore();
  const error = ref(null);

  const callApi = async (url, method = 'GET', data = null, params = null, isLoading = true) => {
    // if(isLoading){

    //   loadingStore.startLoading();
    // }
    error.value = null;

    
    try {
      const headers = {
        'x-api-key': import.meta.env.VITE_API_KEY,
      };

      // Only set Content-Type for non-FormData requests
      // FormData needs the browser to set Content-Type automatically with boundary
      if (!(data instanceof FormData) && data !== null && data !== undefined) {
        headers['Content-Type'] = 'application/json';
      }

      if (userStore.isAuthenticated) {
        headers['Authorization'] = 'Bearer ' + localStorage.getItem("userToken");
      }

      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/api${url}`,
        method,
        ...(data !== null && data !== undefined && { data }), // Only include data if it's not null/undefined
        params, // Pass the query parameters here
        headers,
      });

      return response?.data?.message?.data;
    } catch (err) {
      if (url != '/auth/login' && err.response?.status === 401) {
        //authStore.logout();
      }
      error.value = err.response ? err.response.data : err.message;
      throw err;
    } finally {
      // if(isLoading){
      //   loadingStore.stopLoading();
      // }
    }
  };

  return {
    //loading: computed(() => loadingStore.isLoading),
    error,
    callApi,
  };
};
