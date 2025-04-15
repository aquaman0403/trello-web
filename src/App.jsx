import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ThreeDRotation from '@mui/icons-material/ThreeDRotation';
import Typography  from '@mui/material/Typography'

import {
  useColorScheme,
} from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
  
}

function App() {
  return (
    <>
      <ModeToggle />
      <hr/>
      <div>Vladimir Ducv</div>

      <Typography variant="body2" color='text.secondary'> Test Typography</Typography>

      <Button variant="text">Text</Button>
      <Button variant="contained">Hello world</Button>
      <Button variant="outlined">Outline</Button>
      
      <br />
      <AccessAlarmIcon />
      <ThreeDRotation />
    </>
  )
}

export default App
