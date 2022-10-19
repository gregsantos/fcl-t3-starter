import { ChakraProvider } from '@chakra-ui/react'
import type { AppType } from 'next/dist/shared/lib/utils'
import AuthProvider from '../contexts/AuthContext'
import TransactionProvider from '../contexts/TxContext'
import theme from '../styles/theme'
import '../styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <TransactionProvider>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </TransactionProvider>
  )
}

export default MyApp
