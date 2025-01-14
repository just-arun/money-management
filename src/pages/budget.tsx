import { MonthlyComponent } from "@/components/pages/monthly";
import { GlobalStore } from "@/store/global";
import { useEffect } from "react";

export default function Page() {
  const globalStore = GlobalStore.useContainer();

  useEffect(() => {
    globalStore.initData()
  }, [])


  return (
    <div>
      <h1 className="text-2xl p-4">Monthly Budget</h1>
      <MonthlyComponent />
    </div>
  )
}