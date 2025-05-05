import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentUser: null
}

// Cách hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Note: axios trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo 1 Slice trong Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ (gọi API) và cập nhật dữ liệu vào Redux Store
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAPI.fulfilled, (state, action) => {
        // action.payload: là response.data trả về ở trên
        const user = action.payload
        state.currentUser = user
      })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bới vì những cái actions này đơn giản là được Redux tạo tự động theo tên reducer
// export const {} = userSlice.actions

// Selector: Là nơi dành cho các components bên dưới gọi bằng useSelector() tới nó để lấy dữ liệu từ Redux Store ra để sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer