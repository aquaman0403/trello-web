// Cấu hình Socket-io phía client tại đây và export ra biến socketIoInstance
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants.js'
export const socketIoInstance = io(API_ROOT)