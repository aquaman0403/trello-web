import React, { useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  DragOverlay,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DnDKitSensors'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử được kéo thả là card hoặc column
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    // Columns đã được sắp xếp ở component cha cap nhất (Boards/_id.jsx) rồi
    setOrderedColumns(board?.columns)
  }, [board])

  // Tìm một column theo CardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // Cập nhật state trong trường hợp di chuyển card giữa các columns khác nhau
  // Khởi tạo function chung
  const moveCardBetweenDifferentColumns = (
    overColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    activeColumn,
    overCardId,
    active,
    over,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumn) => {
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - Cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumn)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

      if (nextActiveColumn) {
        // Xoá card ở column active cũng có thể hiểu là một column cũ, cái lúc mà kéo card ra khỏi column đó
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm Placeholder Card nếu Column bị rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cập nhật mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn hay không, nếu có thì xoá nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 columns khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Thêm card đang kéo vào vị overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // Xoá Placeholder Card nếu nó đang tồn tại và column có card khác
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card?.FE_PlaceholderCard)

        // Cập nhật lại cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // Nếu func này được gọi từ handleDragEnd nghĩa là đã khéo thả xong rồi, lúc này mới xử lý gọi API 1 lần ở đây
      if (triggerFrom === 'handleDragEnd') {
        // Phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard_id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDrangEnd này vì sau khi đi qua onDragOver và tới đây là state của card đã bị cập nhật một lần rồi
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId
      ? ACTIVE_DRAG_ITEM_TYPE.CARD
      : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu mà kéo thả card thì mới thực hiện
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    // Nếu không tồn tại active hoặc over thì không làm gì cả (tránh lỗi)
    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // Tìm 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        activeColumn,
        overCardId,
        active,
        over,
        'handleDragOver'
      )
    }
  }

  // Khi kết thúc hành động kéo
  const handleDragEnd = (event) => {

    const { active, over } = event

    // Kiểm tra nếu không tồn tại over thì không làm gì cả (tránh lỗi)
    if (!active || !over) return

    // Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // Tìm 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 columns khác nhau
      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị thay đổi một lần rồi.
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          activeColumn,
          overCardId,
          active,
          over,
          'handleDragEnd'
        )
      } else {
        // Kéo thả card trong cùng một column
        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((card) => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          // Trả về state mới chuẩn vị trí
          return nextColumns
        })

        // Gọi lên props function moveCardInTheSameColumn nằm ờ component cha cao nhất (Boards/_index.jsx)
        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }


    // Xủy lý kéo thả column trong 1 board content
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex((column) => column._id === active.id)
        const newColumnIndex = orderedColumns.findIndex((column) => column._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Cập nhật lại state column ban đầu sau khi kéo thả để tránh delay hoặc flicker
        setOrderedColumns(dndOrderedColumns)

        moveColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị null ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm giao nhau, va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)

    if (!pointerIntersections?.length) return

    // // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    // Tìm overId đầu tiên trong mảng intersections
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // Nếu over là column thì sẽ tìm đến cardId gần nhất trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCorners or closestCenter đều được. Tuy nhiên closestCorners sẽ mượt mà hơn

      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={ activeDragItemData }/> }
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={ activeDragItemData }/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
