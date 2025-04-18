import { createTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },

  colorSchemes:{
    light:{
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },
    dark:{
      palette: {
        primary: cyan,
        secondary: orange
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#1abc9c',
            borderRadius: '8px'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            color: theme.palette.primary.main,
            fontSize: '0.875rem'
          }
        }
      }
    }
  }
})

export default theme