import { createTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, red, teal } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  colorSchemes:{
    light:{
        palette: {
            primary: teal,
            secondary: deepOrange,
        }
    },
    dark:{
        palette: {
            primary: cyan,
            secondary: orange,
        }
    }
  }
})

export default theme