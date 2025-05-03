import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'

// Khởi tạo đối tượng Axios (authorizedAxiosInstance) mục đich để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request là 10 phút
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000 // 10 phút
// withCredentials: cho phép axios tự động gửi cookie trong mỗi request lên server (phục vụ việc chúng ta sẽ lưu JWT tokens (refress & access) vào trong httpOnly cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request và Response)
 * https://axios-http.com/docs/interceptors
 */

// Interceptors Request: Can thiệp vào giữa requests API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Interceptors Request: Can thiệp vào giữa responses nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  /* Mọi mã http status code nằm ngoài 200 - 299 sẽ là error và rơi vào đây */

  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  // Xử lý tập trung phần hiển thị thông báo lỗi và trả về từ mọi API ở đây (viết code 1 lần : Clean Code)

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify để hiển thị thông báo lỗi - ngoại trừ 410 - GONE phục vụ cho việc refresh token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance