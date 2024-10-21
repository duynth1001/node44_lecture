import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'X-RapidAPI-Key':process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host':'youtube-v31.p.rapidapi.com',
  },
};

//Tạo một instannce của axios
export const axiosInstance = axios.create({
  baseURL:`${BASE_URL}`,
  ...options,//áp dụng các tùy chọn mặc định như headers và params
})

//thêm một interceptor để gắn access token vào headers trước mỗi request
axiosInstance.interceptors.request.use(
  (config)=>{
    if (config.requiresAuth) {
      const token = localStorage.getItem("LOGIN_USER");
      if (token) {
        config.headers['token']=`${token}`
      }
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
);

const extendToken = async()=>{
  const {data} = await axiosInstance.post(`/auth/extend-token`,{},{
    withCredentials:true //cho phép gửi và nhận cookie từ server
  })

  //lưu access token mới vào localstorage
  localStorage.setItem("LOGIN_USER",data.data);

  return data;
}

//config interceptor cho response mỗi khi response API nào đó trả về 401
axiosInstance.interceptors.response.use(
  (response)=>{return response}, // param function khi response API trả về 2xx
  async (error)=>{
    const originalRequest = error.config;
    if (error.response.status===401) {
      try {
        const data = await extendToken();
        console.log("data:",data);
        //gán lại token mới vào header
        originalRequest.headers["token"]=data.data;
        //call lại API 1 lần nữa
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log('Extend token failed',error);
      }
    }
    return Promise.reject(error);
  } //param function khi response API trả về khác 2xx
)

export const fetchFromAPI = async (url) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/${url}`, options);

  return data;
};

export const getListVideo = async  ()=>{
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-videos`,options);
  return data
}

export const getType = async ()=>{
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-type`,{
    requiresAuth:true,// đánh dấu rằng yêu cầu này cần xác thực
  });
  return data;
}

export const getVideoById = async(typeId)=>{
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-videos-type-by-id/${typeId}`)
  return data;
}

export const registerAPI = async(payload)=>{
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/register`,payload)
  return data;
}

export const loginAPI = async(payload)=>{
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login`,payload,{
    withCredentials:true// cho phép gửi và nhận cookie từ server (BE)
  })
  return data;
}

export const loginAsyncKeyAPI = async (payload)=>{
  const result = await axiosInstance.post(`${BASE_URL}/auth/login-async-key`,payload,{
    withCredentials:true// cho phép gửi và nhận cookie từ server (BE)
  })
  console.log("get result from loginAsyncKeyAPI:",result);
  if (result.response) {
    throw Error(result.response);
  }
  return result;
}

export const loginFacebookAPI = async(newUser)=>{
  const {data} = await axios.post(`${BASE_URL}/auth/login-face`,newUser);
  return data;
}

export const forgotPassAPI = async (email)=>{
  const {data}= await axiosInstance.post(`${BASE_URL}/auth/forgot-password`,email);
  return data;
}

export const changePassAPI = async (payload)=>{
  //payload: {email,newPass,code}
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/change-password`,payload);
  return data;
}

export const getUserAPI = async ()=>{
  const {data} = await axiosInstance.get(`${BASE_URL}/users/get-users`);
  return data;
}