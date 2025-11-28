import axios from 'axios';
import { ref, computed } from 'vue';
// import { useLoadingStore } from '@/store/loadingStore'; 
// import { useAuthStore } from '@/store/authStore'; 

export const useCallApi = () => {
  // const loadingStore = useLoadingStore();
  // const authStore = useAuthStore();
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
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      // if (authStore.isAuthenticated) {
        // headers['Authorization'] = 'Bearer ' + localStorage.getItem("token");
        headers['Authorization'] = 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1iZXJJZCI6ImI1MTM2YjliLWI1ZWEtNDdiMi1iNGFmLTdjY2E3N2ZlOTFkMiIsImJyYW5kSWQiOiIyZWNkNDYxOS1hM2Y3LTQ3OTgtOTg0MC0yODgwYjc3OWZiNmIiLCJyb2xlIjoibWVtYmVyIiwidHlwZSI6ImFjY2VzcyIsImp0aSI6IjMyYmNjZWE5MGNmMWI0NDQ4YjU5Y2Q2YzIxYzkwYzhmIiwiaWF0IjoxNzY0MzIwNDA0LCJleHAiOjE3NjQ0MDY4MDQsImF1ZCI6ImVuZ2FnZS1zZXJ2aWNlLXVzZXJzIiwiaXNzIjoiZW5nYWdlLXNlcnZpY2UifQ.xAVNrYzdcZqI02mren5QB_6tPbUqcYk-K8QWWg93Ww4";
      // }

      const response = await axios({
        // url: `${import.meta.env.VITE_API_URL}${url}`,
        url: `http://localhost:3000/api${url}`,
        method,
        data,
        params, // Pass the query parameters here
        headers,
      });

      return response?.data?.message?.data;
    } catch (err) {
      if (url != '/auth/login' && err.response?.status === 401) {
        authStore.logout();
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
    loading: computed(() => loadingStore.isLoading),
    error,
    callApi,
  };
};
