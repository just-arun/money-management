import { createContainer } from "@/util/context"
import moment from "moment"
import { useCallback, useMemo, useState } from "react"


export interface Transaction {
  lbl: string
  dT: string
  amt: number
  typ: "in" | "out"
}

export interface Month {
  yearMonth: string
  budget: number
}

export interface MonthReport {
  transactions: Transaction[]
  month: Month
  totalIncome: number
  totalOutgoing: number
}

const Global = (initialData = {transaction: []}) => {
  const [transactionList, setTransactionList] = useState<Transaction[]>(initialData.transaction);

  const addTransaction = (label: string, amount: number, type: "in" | "out", date?: string) => {
    let obj: Transaction = {
      lbl: label,
      amt: amount,
      dT: !!date ? date : new Date().toISOString(),
      typ: type,
    }
    
    let result = [obj, ...transactionList, ]

    localStorage.setItem("transactions", JSON.stringify(result))

    setTransactionList(result)
  }

  const initData = () => {
    let value = localStorage.getItem("transactions")
    if (!!value) {
      try {
        let val: any = JSON.parse(value)
        setTransactionList(val)
      } catch (e) {
        console.log(e);
      }
    }
  }

  // const addMonthBudget = (date: string, budget: number) => {
  //   let obj: Month = {
  //     budget,
  //     yearMonth: date
  //   };
  //   setMonthList([obj, ...monthList]);
  // }

  const monthReport = (month: Month): MonthReport => {
    let result = transactionList.filter((e) => {
      let cur = moment(e.dT)
      let comp = moment(month.yearMonth)
      let left = cur.get("month") + 1 + cur.get("year")
      let right = comp.get("month") + 1 + comp.get("year")
      console.log(left, right, left == right);
      return left ==right
    })
    if (!!!result.length) {
      return {
        transactions: result,
        month: month, 
        totalIncome: 0,
        totalOutgoing: 0
      }
    }
    let inCome = result.filter((e) => e.typ == "in")
    let outGoing = result.filter((e) => e.typ == "out")

    return {
      transactions: result,
      month: month,
      totalIncome: !!inCome.length ? inCome.reduce((x,y) => ({amt: Number(x.amt) + Number(y.amt), dT: "",lbl: "", typ: "in"})).amt : 0,
      totalOutgoing: !!outGoing.length ? outGoing.reduce((x,y) => ({amt: Number(x.amt) + Number(y.amt), dT: "",lbl: "", typ: "in"})).amt : 0,
    }

  }


  const monthList = useMemo(() => {
    let obj = transactionList.reduce((x: any, y: any) => {
      let yM = moment(y.dT)
      let key = `${yM.format("MMM YYYY")}`

      if (!!!x[key]) {
        x[key] = []
      }
      x[key].push(y)
      return x
    }, {})

    let arr = [];

    for (const key in obj) {
      let val = obj[key]
      let amt = val.reduce((x: any, y: any) => {
        let calc = 0;
        if (y.typ == "in") {
          calc = Number(x.amt) + Number(y.amt)
        } else {
          calc = Number(x.amt) - Number(y.amt)
        }
        return {amt: calc}
      }, {amt: 0})
      arr.push({
        key: key,
        date: moment(key).toISOString(),
        amt: !!val.length ? amt.amt : 0
      })
    }
    return arr

  }, [transactionList])


  return {
    transactionList,
    addTransaction,
    initData,
    monthReport,
    monthList
  }
}

export const GlobalStore = createContainer(Global)
