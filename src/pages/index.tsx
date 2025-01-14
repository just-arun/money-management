import { HomeComponent } from "@/components/pages/home";
import { GlobalStore } from "@/store/global";
import { Suspense, useEffect } from "react";


export default function Home() {
  const globalStore = GlobalStore.useContainer();

  useEffect(() => {
    globalStore.initData()
  }, [])

  return (
    <main>
      <Suspense fallback="loading...">
        <HomeComponent />
      </Suspense>
    </main>
  )
}
