import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

interface ChartsProps {
  trendData: any[];
  categoryData: any[];
  stats: any;
}

export default function Charts({ trendData, categoryData, stats }: ChartsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {categoryData.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={(props: any) =>
                    props.percent > 0.05
                      ? `${props.category} ${(props.percent * 100).toFixed(0)}%`
                      : ""
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  formatter={(value) => value ? `Rs.${value.toLocaleString()}` : "Rs.0"}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Income", amount: stats?.totalIncome || 0 },
                { name: "Expenses", amount: stats?.totalExpense || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
                formatter={(value) => value ? `Rs.${value.toLocaleString()}` : "Rs.0"}
              />
              <Bar 
                dataKey="amount" 
                radius={[6, 6, 0, 0]} 
                barSize={50}
                onMouseEnter={() => {}}
                style={{ cursor: 'pointer' }}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}