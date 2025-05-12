import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Cấu hình Redux Persist
const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định, cứ để mặc định là 'root'
  storage: storage, // Biến storage ở trên - lưu vào localStorage
  whitelist: ['user'] // Định nghĩa các slice ĐƯỢC phép duy trì qua mỗi lần f5 trình duyệt
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// Thực hiện persist reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error whent implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false // Bỏ qua kiểm tra tính tuần tự của redux-persist
  })
})