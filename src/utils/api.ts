import axios from  "axios";


const api = axios.create({
    baseURL: 'https://task-management-server-2tup.onrender.com/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  export default api;