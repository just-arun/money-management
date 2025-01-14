import { ArrowsRightLeftIcon, CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

export const Layout: FC<{children: any}> = (props) => {

  const label = [
    {
      label: "Money",
      icon: <ArrowsRightLeftIcon height={24} />,
      path: "/"
    },
    {
      label: "Budget",
      icon: <CalendarDateRangeIcon height={24} />,
      path: "/budget"
    },
    {
      label: "Month",
      icon: <CalendarDateRangeIcon height={24} />,
      path: "/month"
    },
  ];

  const router = useRouter()

  return (
    <div className="layout">
      <div className="content">
        {props.children}
      </div>
      <div className="nav-bar">
        {label.map((e, i) => (
          <Link href={e.path} className={`item ${router.pathname == e.path ? 'active' : ''}`} key={i}>
            {e.icon}
            <span>{e.label}</span>
          </Link>
      ))}
      </div>
    </div>
  )
}