import { FC } from "react";

export const Layout: FC<{children: any}> = (props) => {
  return (
    <div>
      <div>
        {props.children}
      </div>
    </div>
  )
}