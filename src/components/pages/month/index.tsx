import dynamic from 'next/dynamic';
import 'chart.js/auto';
import { GlobalStore } from '@/store/global';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// Function to generate a random hex color code
function getRandomHexColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to generate random RGB color
function getRandomRgbColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Function to generate random HSL color
function getRandomHslColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 101);
  const l = Math.floor(Math.random() * 101);
  return `hsl(${h}, ${s}%, ${l}%)`;
}


const DonutChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
  ssr: false,
});

export const MonthReportChart = () => {

  const globalStore = GlobalStore.useContainer()
  const router = useRouter();

  const data = useMemo(() => {
    let monthReport = globalStore.monthReport({
      budget: 1310,
      yearMonth: `${router.query.key}`,
    })
    
    return {
      labels: [
        'In Come',
        'Expense',
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [
          monthReport.totalIncome,
          monthReport.totalOutgoing,
        ],
        backgroundColor: [
          '#008a2b',
          '#c80000',
        ],
        hoverOffset: 4,
      }]
    }
  }, [globalStore.transactionList, router.query.key]);


  const dataBreakdown = useMemo(() => {
    let report = globalStore.monthReport({
          budget: 1310,
          yearMonth: `${router.query.key}`,
        }).transactions.filter((e) => e.typ == "out")


  const colorCodes = [];
  for (let i = 0; i < report.length; i++) {
    colorCodes.push({
      hex: getRandomHexColor(),
      rgb: getRandomRgbColor(),
      hsl: getRandomHslColor()
    });
  }


    let result = {
      labels: report.map((e) => e.lbl),
      datasets: [{
        label: 'My First Dataset',
        data: report.map((e) => e.amt),
        backgroundColor: colorCodes.map((e) => e.hex),
        hoverOffset: 4,
      }]
    }
  console.log("RESUL", result);
  
  return result
}, [globalStore.transactionList, router.query.key]);

  return (
    <div>
      <h2 className='text-xl pb-2'>Budget/Spending</h2>
      <DonutChart data={data} />
      <h2 className='text-xl pb-2 mt-8'>Breakdown</h2>
      <DonutChart data={dataBreakdown} />
    </div>
  )
}


export const MonthComponent = () => {

  const global = GlobalStore.useContainer();
  const router = useRouter();

  const report = useMemo(() => {
    return global.monthReport({
      budget: 1310,
      yearMonth: `${router.query.key}`,
    }).transactions
  }, [global.transactionList])

  return (
    <div>
      <h1 className='text-2xl p-4'>
        Report For: {moment(router.query.key).format("MMM YYYY")}
      </h1>
      <div className='p-6'>
        <MonthReportChart />
      </div>

      <table className="table-auto">
  <thead>
    <tr>
      <th>Song</th>
      <th>Artist</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
      <td>Malcolm Lockyer</td>
      <td>1961</td>
    </tr>
    <tr>
      <td>Witchy Woman</td>
      <td>The Eagles</td>
      <td>1972</td>
    </tr>
    <tr>
      <td>Shining Star</td>
      <td>Earth, Wind, and Fire</td>
      <td>1975</td>
    </tr>

          {/* {report.map((e, i) => (
            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4">{e.lbl}</td>
              <td className="px-6 py-4">{e.amt}</td>
            </tr>
          ))} */}

  </tbody>
</table>

    </div>
  )
}