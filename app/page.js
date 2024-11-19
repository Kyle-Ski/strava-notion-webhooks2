import ActivitiesList from "./components/ActivitiesList";
import LogsDisplay from "./components/LogsDisplay";
import StravaConnect from "./components/StravaConnectButton";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Strava Dashboard</h1>
      
      <div className="section">
        <StravaConnect/>
      </div>

      <div className="section">
        <ActivitiesList/>
      </div>

      <div className="section">
        <LogsDisplay />
      </div>
    </div>
  );
};

export default Dashboard;
