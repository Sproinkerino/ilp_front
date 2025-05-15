import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
    },
  },
  colors: {
    gray: {
      900: '#111111',
      800: '#1A1A1A',
      700: '#2D2D2D',
      600: '#3D3D3D',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'whiteAlpha',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'whiteAlpha.400',
      },
    },
  },
})

export default theme 