import { ChakraProvider } from '@chakra-ui/react'
import type { AppType } from 'next/dist/shared/lib/utils'
import '../styles/globals.css'
import theme from '../styles/theme'
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
