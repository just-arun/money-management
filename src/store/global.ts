import { createContainer } from "@/util/context"
import { useState } from "react"


interface Transaction {
  lbl: string
  dT: string
  amt: number
  typ: "in" | "out"
}


const Global = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  const addTransaction = (label: string, amount: number, type: "in" | "out") => {
    let obj: Transaction = {
      lbl: label,
      amt: amount,
      dT: new Date().toISOString(),
      typ: type,
    }
    setTransactionList([...transactionList, obj])
  }

  return {
    transactionList,
    addTransaction,
  }
}

export const GlobalStore = createContainer(Global)
