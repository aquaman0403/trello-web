import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = (mainStore) => { axiosReduxStore = mainStore }

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

/**
 * Khởi tạo một cái promise để gọi API refresh token
 * Mục đích của promise này để khi nào gọi API refresh token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
 */
let refreshTokenPromise = null

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

  /** QUAN TRỌNG: Xử lý refreshToken tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE thì gọi API đăng xuất luôn
  if (error.response?.status === 401) {
    // Gọi API logout
    axiosReduxStore.dispatch(logoutUserAPI(false))
    // Hiển thị thông báo lỗi
    toast.error('Your session has expired. Please log in again.')
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE thì sẽ gọi API refresh token để làm mới access token
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests) {
    originalRequests._retry = true

    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện viêc goi API refresh token đồng thời gán cho nó cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Đồng thời accessToken đã nằm trong httpOnly Cookie (xử lý phía BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ API refresh token thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API có oke hay không thì vẫn luôn gán lại cái refreshtoken về null như ban đầu
        })
    }

    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
       * Hiện tại ở đây không cần bước 1 này vì chúng ta cần đưa accessToken vào cookie (xử lý phía BE) sau khi gọi api refresh token thành công
       */

      // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

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