"use client"
import { useState, useEffect } from 'react';
import { generateStravaOAuthUrl } from '@/utils/stravaOauthURLgenerator';

const StravaConnect = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // For simplicity, check for a token in localStorage (adjust as per your auth flow)
    const token = localStorage.getItem('strava_access_token');
    setIsConnected(!!token);
  }, []);

  const handleConnect = () => {
    const url = generateStravaOAuthUrl();
    window.location.href = url; // Redirect to Strava OAuth URL
  };

  return (
    <div className="strava-connect">
      {isConnected ? (
        <p>Connected to Strava</p>
      ) : (
        <button onClick={handleConnect} className="btn btn-primary">
          Connect to Strava
        </button>
      )}
    </div>
  );
};

export default StravaConnect;
