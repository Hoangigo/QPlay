import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { Box, CSSReset, ColorModeProvider, ThemeProvider } from '@chakra-ui/react'
import Header from './components/Helper/Header'
import Footer from './components/Helper/Footer'
import NavBar from './components/Helper/NavBar'
import { theme } from './themes/theme'

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Box display="flex" flexDirection="column" minHeight="100vh" maxW={"100vw"}>
            <Header />
            <NavBar />
            <Box flexGrow={1}>
              <AppRoutes />
            </Box>
            <Footer />
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
