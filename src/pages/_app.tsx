import { Layout } from '@/layout/layout'
import { GlobalStore } from '@/store/global'
import '@/styles/globals.css'
import '@/styles/layout.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <GlobalStore.Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalStore.Provider>
  )
}
