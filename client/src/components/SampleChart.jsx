import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fakeAccountData = [
  {
    accountId: "acc1",
    name: "Checking",
    monthlyBalances: [
      { date: "2024-01-01", balance: 1200 },
      { date: "2024-02-01", balance: 1400 },
      { date: "2024-03-01", balance: 1300 },
      { date: "2024-04-01", balance: 1500 },
    ],
  },
  {
    accountId: "acc2",
    name: "Investment",
    monthlyBalances: [
      { date: "2024-01-01", balance: 5000 },
      { date: "2024-02-01", balance: 5200 },
      { date: "2024-03-01", balance: 5500 },
      { date: "2024-04-01", balance: 5600 },
    ],
  },
];

function aggregateMonthlyNetWorth(accounts) {
  const netWorthByMonth = {};

  accounts.forEach(account => {
    account.monthlyBalances.forEach(({ date, balance }) => {
      if (!netWorthByMonth[date]) {
        netWorthByMonth[date] = 0;
      }
      netWorthByMonth[date] += balance;
    });
  });

  return Object.entries(netWorthByMonth)
    .map(([date, totalBalance]) => ({ date, totalBalance }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function NetWorthGraph() {
  const data = aggregateMonthlyNetWorth(fakeAccountData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })} />
        <YAxis />
        <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
        <Line type="monotone" dataKey="totalBalance" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
