"use client"
import { useState, useEffect } from 'react';
// import { getAllActivities } from '../utils/stravaUtils';

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('strava_access_token');
      if (!token) return;

      setLoading(true);
      try {
        // const fetchedActivities = await getAllActivities(token);
        // setActivities(fetchedActivities);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="activities-list">
      <h3>Your Activities</h3>
      {loading ? (
        <p>Loading...</p>
      ) : activities.length > 0 ? (
        <ul>
          {activities.slice(0, 5).map((activity) => (
            <li key={activity.id}>
              <p><strong>{activity.name}</strong></p>
              <p>{activity.distance} meters - {activity.type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities available.</p>
      )}
    </div>
  );
};

export default ActivitiesList;
