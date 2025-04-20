import React from 'react'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Chip from '@mui/material/Chip'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'

const MENU_STYLE = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 2,
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        borderBottom: '1px solid white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={ MENU_STYLE }
          icon={<DashboardIcon />}
          label="Vladmir Ducv"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={ MENU_STYLE }
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderWidth: '2px' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 36,
              height: 36,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
          <Tooltip title="valdimir">
            <Avatar
              alt="Vladimir Ducv"
              src="/static/images/avatar/1.jpg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
