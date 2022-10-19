import { createContext, useContext, useState, ReactNode } from 'react'

// https://docs.onflow.org/fcl/reference/api/#transaction-statuses
/**
 * STATUS CODE  DESCRIPTION <br/>
 * -1 No Active Transaction<br/>
 * 0  Unknown<br/>
 * 1  Transaction Pending - Awaiting Finalization<br/>
 * 2  Transaction Finalized - Awaiting Execution<br/>
 * 3  Transaction Executed - Awaiting Sealing<br/>
 * 4  Transaction Sealed - Transaction Complete. At this point the transaction result has been committed to the blockchain.<br/>
 * 5  Transaction Expired<br/>
 */

interface Props {
  children?: ReactNode
}

interface TxContextInterface {
  transactionInProgress: boolean
  transactionStatus: number | null
  txId: string | null
  initTransactionState: () => void
  setTxId: (transactionId: string) => void
  setTransactionStatus: (statusCode: number) => void
}

export const TransactionContext = createContext<TxContextInterface | null>(null)

export const useTransaction = () => useContext(TransactionContext)

export default function TransactionProvider({ children }: Props) {
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<number | null>(
    null
  )
  const [txId, setTxId] = useState('')

  function initTransactionState() {
    setTransactionInProgress(true)
    setTransactionStatus(null)
  }

  const value: TxContextInterface = {
    transactionInProgress,
    transactionStatus,
    txId,
    initTransactionState,
    setTxId,
    setTransactionStatus,
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}
