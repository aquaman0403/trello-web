import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

// Khởi tạo giá trị State của một Slice trong Redux
const initialState = {
  currentActiveBoard: null
}

// Cách hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Note: axios trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo 1 Slice trong Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Lưu ý: Ở đây luôn luôn cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong có 1 dòng, đêy là rule của Redux
    updateCurrentActiveBoard: (state, action) => {
      // action.payload: chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu nếu cần thiết
      //...

      // Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ (gọi API) và cập nhật dữ liệu vào Redux Store
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        // action.payload: là response.data trả về ở trên
        let board = action.payload

        // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các components con
        board.columns = mapOrder(board?.columns, board.columnOrderIds, '_id')

        board.columns.forEach(column => {
          if (isEmpty(column.cardOrderIds)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            // Sắp xếp thứ tự các card trong column trước khi đưa dữ liệu xuống bên dưới các components con
            column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
          }
        })

        // Update lại dữ liệu của currentActiveBoard
        state.currentActiveBoard = board
      })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bới vì những cái actions này đơn giản là được Redux tạo tự động theo tên reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector: Là nơi dành cho các components bên dưới gọi bằng useSelector() tới nó để lấy dữ liệu từ Redux Store ra để sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// File này tên là activeBoardSlice NHƯNG chúng ta sẽ export một thứ tên là Reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer