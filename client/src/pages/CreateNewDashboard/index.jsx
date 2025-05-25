import { useState } from "react";
import SampleChart from "../../components/SampleChart";
import CategoryBarChart from "../../components/CategoryBarChart";
import { useAuth0 } from "@auth0/auth0-react";

export default function CreateDashboard() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [selectedOption, setSelectedOption] = useState("networth");
  const [dashboardName, setDashboardName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const getChartData = () => {
    const isNetWorth = selectedOption === "networth";
    return {
      id: "chart1",
      type: selectedOption === "networth" ? selectedOption : "category",
      chartType: isNetWorth ? "line" : "bar",
      filters: isNetWorth ? {} : { category: selectedOption },
    };
  };

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!dashboardName.trim()) {
      setError("Please enter a dashboard name.");
      return;
    }

    setLoading(true);

    const dashboardData = {
      userId: user.sub,
      name: dashboardName,
      charts: [getChartData()],
    };

    try {
      const token = await getAccessTokenSilently();

      const res = await fetch("http://localhost:3000/api/dashboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dashboardData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save dashboard");
      }

      setSuccess("Dashboard saved successfully!");
      setDashboardName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="create-dashboard">
      <h2>Create a New Dashboard</h2>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="dashboard-name">Dashboard Name</label>
          <input
            id="dashboard-name"
            type="text"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder="Enter dashboard name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tracking-type">What do you want to track?</label>
          <select id="tracking-type" value={selectedOption} onChange={handleChange}>
            <option value="networth">Track Net Worth</option>
            <option value="dining">Track Dining / Restaurants</option>
            {/* Add more tracking options here */}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Dashboard"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>

      <div className="chart-preview" style={{ marginTop: "2rem" }}>
        {selectedOption === "networth" && <SampleChart />}
        {selectedOption === "dining" && <CategoryBarChart />}
      </div>
    </main>
  );
}
