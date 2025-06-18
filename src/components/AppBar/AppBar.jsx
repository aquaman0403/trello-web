import React from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppIcons from '@mui/icons-material/Apps'
import TrelloLogo from '~/assets/trello.svg?react'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Status from './Menus/Status'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingX: 2,
        gap: 2,
        overflow: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to="/boards">
          <Tooltip title='Boards list' >
            <AppIcons fontSize="medium" sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>
        <Link to="/">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloLogo} inheritViewBox fontSize='small' sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Status />
          <Templates />
          <Button
            sx={{ color: 'white', border: 'none' }}
            startIcon={ <LibraryAddIcon/> }
          >
            Create
          </Button>
        </Box>

      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        {/** Dark-Light Mode */}
        <ModeSelect />

        {/** Xử lý hiển thị các thông báo */}
        <Notifications />

        <Tooltip title='Help' >
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
