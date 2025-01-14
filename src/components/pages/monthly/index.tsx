import { GlobalStore } from "@/store/global"
import Link from "next/link";



export const MonthlyComponent = () => {
  const globalStorage = GlobalStore.useContainer();

  return (
    <div className="grid gap-1">
      {globalStorage.monthList.map((e, i) => (
        <Link href={{
          pathname: "/month",
          query: {
            key: e.date,
            amt: 0
          }
        }} key={i} className="block p-4 border-b border-red-[#e5e7eb]">
          <div className="flex justify-between items-center">
          <div className="text-2xl">{e.key}</div>
          <div>
            <div>
              Remaining
            </div>
            <div>
            {Number(e.amt).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
            })}
            </div>
          </div>
          </div>
        </Link>
      ))}
    </div>
  )
}