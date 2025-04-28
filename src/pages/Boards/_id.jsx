import * as React from 'react'
import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useState, useEffect } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '680ceac3d54d3e1af8f36de0'

    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {

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
      setBoard(board)
    })
  }, [])

  // Function này có nhiệm vụ gọi API tạo mới một Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Khi tạo một column mới, thì nó chưa có card, cần xử lý để kéo thả card vào column rỗng này
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại State Board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Function này có nhiệm vụ gọi API tạo mới một Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại State Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Gọi API và xử lý khi kéo thẻ Column
  const moveColumns = (dndOrderedColumns) => {
    // Cap nhat lai cho chuan du lieu State Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Call API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }

  /**
   * Khi di chuyển card trong cùng 1 column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds trong column chứa nó (thay đỏi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Cap nhat lai cho chuan du lieu State Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Call API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress/>
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
      />
    </Container>
  )
}

export default Board
