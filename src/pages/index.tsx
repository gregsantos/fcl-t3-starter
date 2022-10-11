import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import { Button } from '@chakra-ui/react'
import Image from 'next/image'
import useUtils from '../utils/index.mjs'
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

const Home: NextPage = () => {
  const [walletServices, setWalletServices] = useState<fcl.WalletService[]>([])
  const { currentUser, profileExists, logOut, logIn, signUp, createProfile } =
    useAuth()
  const utils = useUtils()
  const hooks = useHooks()
  //const currentUser = hooks.useCurrentUser()
  const config = hooks.useConfig()
  console.log(config, currentUser)

  useEffect(() => {
    const fetchServices = async () =>
      await fcl.discovery.authn.subscribe(res => {
        console.log('discovery api services', res)
        setWalletServices(res.results)
      })
    fetchServices()
  }, [])

  useEffect(() => {
    import('../flow/decorate.mjs')
  }, [])

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

        <p className="text-2xl text-gray-700">This stack uses:</p>
        {currentUser?.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
      </main>
      <DarkModeSwitch />
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
