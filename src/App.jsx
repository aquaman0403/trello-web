import NotFound from './pages/404/NotFound'
import Board from './pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        /**
         * Ở đây cần replace giá trị true để nó thay thể route /, có thể có nhiều route / sẽ không còn nằm trong history browser
         * Thực hành dễ hiểu hơn bằng cách nhấn vào Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có và không có replace
         */
        <Navigate to='/boards/680ceac3d54d3e1af8f36de0' replace={true}/>}
      />

      <Route element={<ProtectedRoute user={currentUser} />} >
        <Route path='/boards/:boardId' element={<Board />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
