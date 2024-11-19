"use client"
import { useState, useEffect } from 'react';
// import { getLogs } from '@/utils/logHelpers';


const LogsDisplay = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // const fetchedLogs = await getLogs(); // Assuming `getLogs` retrieves the logs from Notion
        setLogs(null);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="logs-display">
      <h3>Webhook Logs</h3>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length > 0 ? (
        <ul>
          {logs.slice(0, 5).map((log, index) => (
            <li key={index}>
              <p>{log.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs available.</p>
      )}
    </div>
  );
};

export default LogsDisplay;
