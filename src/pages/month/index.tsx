import { MonthComponent } from "@/components/pages/month";
import { GlobalStore } from "@/store/global";
import { useEffect } from "react";

export default function Page() {

  const globalStore = GlobalStore.useContainer();

  useEffect(() => {
    globalStore.initData()
  }, [])


  return (
    <div>
      <MonthComponent />
    </div>
  )
}