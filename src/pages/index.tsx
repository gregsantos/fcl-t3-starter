import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import { Button } from '@chakra-ui/react'
import Image from 'next/image'
import useHooks from '../hooks'
import { DarkModeSwitch, Transaction, Profile } from '../components'
import { useAuth } from '../contexts/AuthContext'

type TechnologyCardProps = {
  name: string
  icon: string
  description: string
  website: string
  auth: () => void
}

const DevWalletServicePlugin = {
  name: 'fcl-plugin-service-devwallet',
  f_type: 'ServicePlugin',
  type: 'discovery-service',
  services: [
    {
      f_type: 'Service',
      f_vsn: '1.0.0',
      type: 'authn',
      method: 'IFRAME/RPC',
      uid: 'authn#dev2',
      endpoint: 'http://localhost:8701/fcl/authn',
      provider: {
        address: '0xf8d6e0586b0a20c8',
        name: 'FCL Dev Wallet 2',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA1OCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjczNDggMTEuOTI4N0gzMS4yMDQ1VjE3LjYzMTdIMjkuMDY1OVYxMS45Mjg3SDI3Ljk2MDlWMTAuMDk2NkgyOS4wNjU5VjkuMzgzNzVDMjkuMDY1OSA3LjUzNzQxIDMwLjIxODQgNi41ODkyOSAzMS45NzIgNi41ODkyOUMzMi4yNDMyIDYuNTkxODcgMzIuNTEzMyA2LjYyMzc0IDMyLjc3NzYgNi42ODQzNFY4LjgyMjk2QzMyLjU0NiA4LjczMTM5IDMyLjI5OTQgOC42ODM4NCAzMi4wNTA0IDguNjgyNzZDMzEuODIzNyA4LjY2NTQ3IDMxLjYwMDggOC43NDgwMiAzMS40NCA4LjkwODc5QzMxLjI3OTMgOS4wNjk1NSAzMS4xOTY3IDkuMjkyNSAzMS4yMTQgOS41MTkyVjEwLjA4NzFIMzIuNzQ0M0wzMi43MzQ4IDExLjkyODdaTTM1Ljk1NyAxNy42MzE3SDMzLjc5NDZWNi43NDg1SDM1Ljk1N1YxNy42MzE3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTQwLjc1NzggOS42MjM3OUM0Mi40MTYgOS42MjA5IDQzLjkxMjQgMTAuNjE4IDQ0LjU0ODQgMTIuMTQ5NEM0NS4xODQzIDEzLjY4MDkgNDQuODM0MiAxNS40NDQ2IDQzLjY2MTcgMTYuNjE3MkM0Mi40ODkxIDE3Ljc4OTcgNDAuNzI1NCAxOC4xMzk4IDM5LjE5MzkgMTcuNTAzOUMzNy42NjI1IDE2Ljg2NzkgMzYuNjY1NCAxNS4zNzE1IDM2LjY2ODMgMTMuNzEzM0MzNi42NTQ3IDEyLjYyNDYgMzcuMDgxMyAxMS41NzY1IDM3Ljg1MTEgMTAuODA2NkMzOC42MjEgMTAuMDM2OCAzOS42NjkxIDkuNjEwMjUgNDAuNzU3OCA5LjYyMzc5Wk00MC43NTc4IDE1LjcxNjVDNDEuODYyNyAxNS43MTY1IDQyLjY1ODggMTQuODAxNiA0Mi42NTg4IDEzLjcxMzNDNDIuNjU4OCAxMi42MjUgNDEuODY5OSAxMS43MjIgNDAuNzU3OCAxMS43MjJDMzkuNjgxNiAxMS43NTkxIDM4LjgyODMgMTIuNjQyNCAzOC44MjgzIDEzLjcxOTJDMzguODI4MyAxNC43OTYxIDM5LjY4MTYgMTUuNjc5MyA0MC43NTc4IDE1LjcxNjVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNNDcuMTAzOCA5Ljc4MDU4TDQ4LjQ5MTUgMTUuMDA4M0w0OS44ODE2IDEwLjg1N0w0OS41MDM4IDkuNzgyOTVINTEuNjQyNEw1My40NzQ0IDE1LjAxMDdMNTQuODMzNyA5Ljc4Mjk1SDU3LjA1NzhMNTQuNzIyIDE3LjY0NTlINTIuNDgxMkw1MC45MTc2IDEzLjMzNTRMNDkuNDY1NyAxNy42NDU5SDQ3LjIwODNMNDQuODg2NyA5Ljc4Mjk1TDQ3LjEwMzggOS43ODA1OFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMS45MDA3IDIzLjgzODRDMTguNDYyNSAyMy44Mzg0IDIzLjc4MTkgMTguNTE5IDIzLjc4MTkgMTEuOTU3MkMyMy43ODE5IDUuMzk1NDQgMTguNDYyNSAwLjA3NjA0OTggMTEuOTAwNyAwLjA3NjA0OThDNS4zMzg5MiAwLjA3NjA0OTggMC4wMTk1MzEyIDUuMzk1NDQgMC4wMTk1MzEyIDExLjk1NzJDMC4wMTk1MzEyIDE4LjUxOSA1LjMzODkyIDIzLjgzODQgMTEuOTAwNyAyMy44Mzg0WiIgZmlsbD0iIzAwRUY4QiIvPgo8cGF0aCBkPSJNMTcuMTE3IDEwLjA5NjZIMTMuNzYxN1YxMy40NTE5SDE3LjExN1YxMC4wOTY2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwLjQwNTQgMTQuNzA4OUMxMC40MDY0IDE1LjIxODcgMTAuMDk5OSAxNS42Nzg4IDkuNjI5MDkgMTUuODc0NEM5LjE1ODI3IDE2LjA2OTkgOC42MTYgMTUuOTYyMyA4LjI1NTUxIDE1LjYwMThDNy44OTUwMSAxNS4yNDEzIDcuNzg3NDIgMTQuNjk5IDcuOTgyOTYgMTQuMjI4MkM4LjE3ODUgMTMuNzU3NCA4LjYzODYgMTMuNDUwOSA5LjE0ODQyIDEzLjQ1MTlIMTAuNDA1NFYxMC4wOTY2SDkuMTQ4NDJDNy4yODE1MyAxMC4wOTU3IDUuNTk3OTggMTEuMjE5NiA0Ljg4MzExIDEyLjk0NDJDNC4xNjgyNCAxNC42Njg4IDQuNTYyOSAxNi42NTQyIDUuODgyOTkgMTcuOTc0M0M3LjIwMzA3IDE5LjI5NDQgOS4xODg0OSAxOS42ODkxIDEwLjkxMzEgMTguOTc0MkMxMi42Mzc3IDE4LjI1OTMgMTMuNzYxNyAxNi41NzU4IDEzLjc2MDcgMTQuNzA4OVYxMy40NTE5SDEwLjQwNTRWMTQuNzA4OVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNS4wMTg1IDguNDE5MDNIMTguNzkyVjUuMDY2MTZIMTUuMDE4NUMxMi40NzIzIDUuMDY4NzggMTAuNDA4OSA3LjEzMjIzIDEwLjQwNjIgOS42Nzg0NFYxMC4wOTY3SDEzLjc2MTVWOS42Nzg0NEMxMy43NjI4IDguOTg0MzUgMTQuMzI0NCA4LjQyMTY0IDE1LjAxODUgOC40MTkwM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMC40MDYyIDEzLjQ1MTlIMTMuNzYxNVYxMC4wOTY2SDEwLjQwNjJWMTMuNDUxOVoiIGZpbGw9IiMxNkZGOTkiLz4KPC9zdmc+Cg==',
        description: 'FCL Dev Wallet',
        website: '',
      },
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serviceStrategy: { f_type: 'Service', method: 'IFRAME/RPC', exec: () => {} },
}

const Home: NextPage = () => {
  const [walletServices, setWalletServices] = useState<fcl.WalletService[]>([])
  const hooks = useHooks()
  const auth = useAuth()
  //const currentUser = hooks.useCurrentUser()
  const config = hooks.useConfig()

  useEffect(() => {
    const fetchServices = async () =>
      await fcl.discovery.authn.subscribe(res => {
        setWalletServices(res.results)
      })
    fetchServices()
  }, [])

  useEffect(() => {
    import('../flow/decorate.mjs')
  }, [])

  useEffect(() => {
    fcl.pluginRegistry.add(DevWalletServicePlugin)
  }, [])

  if (!auth) return null
  const { currentUser, profileExists, logOut, logIn, createProfile } = auth
  console.log(config, currentUser)

  const AuthedState = () => {
    return (
      <div>
        <div>Logged in as: {currentUser?.addr ?? 'No Address'}</div>
        <Button onClick={logOut}>Log Out</Button>

        <h2>Controls</h2>
        <Button onClick={createProfile}>Create Profile</Button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-3 lg:w-2/3">
        {walletServices?.map(service => (
          <TechnologyCard
            key={service.uid}
            name={service.provider.name}
            icon={service.provider.icon}
            description={service.provider.description}
            website={service.provider.website}
            auth={() => logIn(service)}
          />
        ))}
      </div>
    )
  }

  const Messages = () => {
    if (!currentUser?.loggedIn) {
      return 'Get started by logging in or signing up.'
    } else {
      if (profileExists) {
        return 'Your Profile lives on the blockchain.'
      } else {
        return 'Create a profile on the blockchain.'
      }
    }
  }

  return (
    <>
      <Head>
        <title>FCL T3 App</title>
        <meta name="description" content="FCL T3 App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <Transaction />
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Base <span className="text-purple-300">FCL</span> App
        </h1>
        <p>
          <Messages />
        </p>
        {profileExists && <Profile />}

        {currentUser?.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
        <DarkModeSwitch />
      </main>
    </>
  )
}

export default Home

const TechnologyCard = ({
  name,
  icon,
  description,
  website,
  auth,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700" onClick={auth}>
        {name}
      </h2>
      <div>
        <Image src={icon} alt="Wallet Icon" width={25} height={25} />
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={website}
        target="_blank"
        rel="noreferrer"
      >
        Website
      </a>
    </section>
  )
}
