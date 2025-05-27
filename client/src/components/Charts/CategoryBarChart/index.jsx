import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Mock data: dining spending per month
const diningData = [
  { month: "Jan", amount: 230 },
  { month: "Feb", amount: 195 },
  { month: "Mar", amount: 245 },
  { month: "Apr", amount: 210 },
];

export default function CategoryBarChart({graphColor}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={diningData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill={graphColor ? graphColor:  "#8884d8"} />
      </BarChart>
    </ResponsiveContainer>
  );
}
