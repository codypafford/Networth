import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SampleChart from "../../components/SampleChart";
import CategoryBarChart from "../../components/CategoryBarChart";
import ChartContainer from "../../components/ChartContainer";
import './style.scss';

export default function Dashboard() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchDashboards() {
      setLoading(true);
      setError(null);

      try {
        const token = await getAccessTokenSilently();

        const res = await fetch(`http://localhost:3000/api/dashboards?userId=${encodeURIComponent(user.sub)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboards");
        }

        const data = await res.json();
        setDashboards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboards();
  }, [user, getAccessTokenSilently]);

  function renderChart(chart, dashboard) {
    if (chart.chartType === "line") {
      return (<ChartContainer title={dashboard.name}>
                <SampleChart key={chart.id} />
            </ChartContainer>);
    } else if (chart.chartType === "bar") {
      return (<ChartContainer title={dashboard.name}>
                <CategoryBarChart key={chart.id} />
            </ChartContainer>);
    }
    return null;
  }

  return (
    <main className="dashboard">
      <h2>Welcome, {user?.name}!</h2>
      
      <button className="create-dashboard-btn" onClick={() => navigate("/create-dashboard")}>
        Create New Dashboard
      </button>

      {loading && <p>Loading dashboards...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {dashboards.length === 0 && !loading && <p>No dashboards found. Create one!</p>}

      <div className="dashboard-list">
        {dashboards.map((dashboard) => (
          <div key={dashboard._id} className="dashboard-item">
            <div className="chart-container">
              {dashboard.charts.map((chart) => renderChart(chart, dashboard))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
