import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import '../flow/config'

export function useConfig() {
  const [config, setConfig] = useState(null)
  useEffect(() => fcl.config().subscribe(setConfig), [])
  return config
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [])
  return currentUser
}
