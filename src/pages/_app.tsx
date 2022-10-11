import { ChakraProvider } from '@chakra-ui/react'
import type { AppType } from 'next/dist/shared/lib/utils'
import AuthProvider from '../contexts/AuthContext'
import TransactionProvider from '../contexts/TxContext'
import theme from '../styles/theme'
import '../styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <TransactionProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </TransactionProvider>
    </ChakraProvider>
  )
}

export default MyApp
