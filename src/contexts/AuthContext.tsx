import * as fcl from '@onflow/fcl'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useTransaction } from './TxContext'

interface Props {
  children?: ReactNode
}

interface AuthContextInterface {
  currentUser: unknown
  userProfile: unknown
  profileExists: unknown
  logOut: unknown
  logIn: unknown
  loadProfile: unknown
  createProfile: unknown
  updateProfile: (opts: {
    name: string
    color: string
    info: string
  }) => Promise<void>
}

export const AuthContext = createContext<AuthContextInterface | null>(null)

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: Props) {
  const [currentUser, setUser] = useState<fcl.CurrentUserObject | null>(null)
  const [userProfile, setProfile] = useState(null)
  const [profileExists, setProfileExists] = useState(false)
  const tx = useTransaction()
  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const loadProfile = useCallback(async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(currentUser?.addr, t.Address)],
    })
    setProfile(profile ?? null)
    setProfileExists(profile !== null)
    return profile
  }, [currentUser, setProfile, setProfileExists])

  useEffect(() => {
    if (currentUser?.loggedIn && userProfile === null) {
      loadProfile()
    }
  }, [currentUser, userProfile, loadProfile])

  if (!tx) return null
  const { initTransactionState, setTxId, setTransactionStatus } = tx

  const logOut = async () => {
    await fcl.unauthenticate()
    setUser(null)
    setProfile(null)
    setProfileExists(false)
  }

  const logIn = (service: fcl.WalletService) => {
    fcl.authenticate({ service })
  }

  const createProfile = async () => {
    initTransactionState()

    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      limit: 50,
    })
    setTxId(transactionId)
    fcl.tx(transactionId).subscribe(res => {
      setTransactionStatus(res.status)
      if (res.status === 4) {
        loadProfile()
      }
    })
  }

  const updateProfile = async ({
    name,
    color,
    info,
  }: {
    name: string
    color: string
    info: string
  }) => {
    initTransactionState()

    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String, color: String, info: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setInfo(info)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setColor(color)
          }
        }
      `,
      args: (arg, t) => [
        arg(name, t.String),
        arg(color, t.String),
        arg(info, t.String),
      ],
      limit: 50,
    })
    setTxId(transactionId)
    fcl.tx(transactionId).subscribe(res => {
      setTransactionStatus(res.status)
      if (res.status === 4) {
        loadProfile()
      }
    })
  }

  const value: AuthContextInterface = {
    currentUser,
    userProfile,
    profileExists,
    logOut,
    logIn,
    loadProfile,
    createProfile,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
