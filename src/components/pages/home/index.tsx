import { GlobalStore, Transaction } from "@/store/global"
import { FC, useEffect, useMemo, useState } from "react"
import style from './home.module.scss'
import { PlusCircleIcon } from "@heroicons/react/24/outline"
import moment from "moment"

interface TransactionTileType {
  data: Transaction
  onClick: () => void
}

const TransactionTile: FC<TransactionTileType> = (_props) => {
  return (
    <div className={style.transactionTile} onClick={() => _props.onClick()}>
      <div className={style.transactionTileLabel}>{_props.data.lbl}</div>
      <div className={style.transactionTileDateTime}>{moment(_props.data.dT).format("DD MMM, YYYY hh:mm:A")}</div>
      <div className={`${style.transactionTileAmount} ${_props.data.typ == "out" ? 'text-red-600 bg-red-950' : 'text-green-600 bg-green-950'}`}>
        <span className="font-bold text-xl text-right">
          {_props.data.typ == "in" ? '+ ' : '- '}{(_props.data.amt).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
        </span>
      </div>
    </div>
  )
}

const NewTransactionForm: FC<{
  onSubmit: (label: string, amount: number, type: any) => void
  cancel: () => void
  type: "new" | "update"
  value: Transaction | null
  delete: () => void
}> = (props) => {

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(false)
    setTimeout(() => {
      setShow(true)
      window.scrollTo({top: 0});
    }, 100);
  }, [props.value])

  return ( show ?
      <form onSubmit={(e) => {
        e.preventDefault()
        let target: any = e.target
        props.onSubmit(target.elements.label.value, target.elements.amount.value, target.elements.inputType.value, );
      }} className="p-3 m-2 shadow-md shadow-neutral-800 rounded-md">
        <h1 className="text-xl">New Transaction</h1>
        <label htmlFor="label" className="py-2 inline-block w-full">
          <span>Label</span>
          <input defaultValue={!!props.value ? props.value.lbl : ""} required className="p-2 bg-[#363636] w-full font-lg" type="text" name="label" id="label" placeholder="label" />
        </label>
        
        <label htmlFor="amount" className="py-2 inline-block w-full">
          <span>Amount</span>
          <input defaultValue={!!props.value ? props.value.amt : 0} required className="p-2 bg-[#363636] w-full font-lg" type="number" name="amount" id="amount" placeholder="amount" /> <br />
        </label>

      {props.type == "update" ? <div>
        {moment(props.value?.dT).format("DD MM, YYYY hh:mmA")}
      </div> : <div>
          <label htmlFor="amount" className="py-2 inline-block w-full">
            <span>Date Time</span>
            <input defaultValue={new Date().toISOString()} className="p-2 bg-[#363636] w-full font-lg" type="datetime-local" name="date" id="date" placeholder="date time" /> <br />
          </label>
        </div>}

      <div className="flex w-full pt-2">
        <label htmlFor="in" className="p-2 bg-[#363636] text-lg flex-1">
          <input readOnly={props.type == "update"} defaultChecked={!!props.value ? props.value.typ == "in" : false} required type="radio" name="inputType" value={"in"} id="in" />
          <span className="pl-2 inline-block">InCome</span>
        </label>
        
        <label htmlFor="out" className="p-2 bg-[#363636] text-lg flex-1">
          <input readOnly={props.type == "update"} defaultChecked={!!props.value ? props.value.typ == "out" : false} required type="radio" name="inputType" value={"out"} id="out" />
          <span className="pl-2 inline-block" >Out Going</span>
        </label>
      </div>

      <div className="w-full flex">
        <button type="button" onClick={() => props.cancel()} className="py-4 px-4 flex-1 bg-slate-900 mt-5">cancel</button>
        <button type="submit" className="py-4 px-4 flex-1 bg-slate-800 mt-5">
          {props.type == 'new' ? 'submit' : 'update'}
        </button>
      </div>
      </form> : <></>
  )
}


export const HomeComponent = () => {

  const globalStore = GlobalStore.useContainer();
  
  const [newTransaction, setNewTransaction] = useState(false);


  const addTransaction = (label:string, amount: number, type: any, date?: string) => {
    globalStore.addTransaction(label, Number(amount), type, date)
    setNewTransaction(false)
    setSelectedItem(null);
  }

  const [selectedItem, setSelectedItem] = useState<null|{value: Transaction, index: number}>(null);


  const deleteItem = () => {

  }

  return (
    <div className={style.TransactionTileList}>

      {newTransaction || !!!globalStore.transactionList.length || !!selectedItem ? 
        <NewTransactionForm 
          onSubmit={addTransaction} 
          cancel={() => {
            setNewTransaction(false);
            setSelectedItem(null);
          }} 
          delete={deleteItem}
          type={!!selectedItem ? "update" : "new"}
          value={!!selectedItem ? selectedItem.value : null}
        />
      : 
        <button className="fixed bottom-24 right-3 z-10 rounded-full bg-slate-700 w-24 flex items-center px-2 py-1 active:bg-slate-500" 
        onClick={() => {
          setNewTransaction(true)
        }}>
          <PlusCircleIcon height={30} />
          <span className="pl-2">ADD</span>
        </button>
      }

      {globalStore.transactionList.sort((x,y) => moment(x.dT) < moment(y.dT) ? 1 : -1).map((e, i) => (
        <TransactionTile 
          key={i} 
          data={e} 
          onClick={() => {
          setNewTransaction(false);
          setSelectedItem(() => null);
          setSelectedItem(() => ({value: e, index: i}));
        }} />
      ))}

    </div>
  )
}