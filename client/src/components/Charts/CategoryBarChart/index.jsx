import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

// Mock data: dining spending per month
const diningData = [
  { month: 'Jan', amount: 230 },
  { month: 'Feb', amount: 195 },
  { month: 'Mar', amount: 245 },
  { month: 'Apr', amount: 210 }
]

export default function CategoryBarChart({ graphColor, dateRange }) {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={diningData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='amount' fill={graphColor ? graphColor : '#8884d8'} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  // Format date nicely
  // const formattedDate = new Date(label).toLocaleDateString('en-US', {
  //   month: 'short',
  //   day: 'numeric',
  //   year: 'numeric'
  // })

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '8px',
        borderRadius: '4px',
        boxShadow: '0 0 5px rgba(0,0,0,0.2)'
      }}
    >
      {/* <p>{formattedDate}</p> */}
      <p>
        <strong>Total Balance:</strong> {payload[0].value}
      </p>
    </div>
  )
}
