import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Activity, Zap, Users, TrendingUp } from 'lucide-react';
import './index.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [forecastData, setForecastData] = useState<any>(null);
  const [clusterData, setClusterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forecastRes, clusterRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/forecast`),
          axios.get(`${API_BASE_URL}/clusters`)
        ]);
        setForecastData(forecastRes.data);
        setClusterData(clusterRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
        <h2>Analyzing Smart Meter Data...</h2>
      </div>
    );
  }

  // Combine historical and forecast for the chart
  const combinedForecast = [
    ...(forecastData?.historical || []).slice(-15), // last 15 historical points
    ...(forecastData?.forecast || [])
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="header">
        <h1>Energy Analytics Hub</h1>
        <p>AI-Powered Insights from Smart Meter Data</p>
      </header>

      {/* KPI Overview */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div className="card-title">
            <Users className="text-accent-cyan" size={24} /> Total Households
          </div>
          <div className="stat-value">5,566</div>
          <div className="stat-label">Monitored in London</div>
        </div>
        <div className="glass-card">
          <div className="card-title">
            <Zap className="text-primary" size={24} /> Peak Consumption
          </div>
          <div className="stat-value">{forecastData?.forecast ? Math.round(Math.max(...forecastData.forecast.map((d: any) => d.upper))) : 'N/A'} kWh</div>
          <div className="stat-label">Predicted 30-day peak</div>
        </div>
        <div className="glass-card">
          <div className="card-title">
            <TrendingUp className="text-accent-pink" size={24} /> AI Forecasting
          </div>
          <div className="stat-value">Active</div>
          <div className="stat-label">Prophet Time-Series Model</div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Forecast Chart */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-title">
            <Activity size={24} /> 30-Day Energy Consumption Forecast
          </div>
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedForecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="energy" name="Expected Energy (kWh)" stroke="#6366f1" fillOpacity={1} fill="url(#colorEnergy)" />
                {forecastData?.forecast && <Area type="monotone" dataKey="upper" name="Upper Bound" stroke="transparent" fill="#06b6d4" fillOpacity={0.2} />}
                {forecastData?.forecast && <Area type="monotone" dataKey="lower" name="Lower Bound" stroke="transparent" fill="#06b6d4" fillOpacity={0.2} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clustering Chart */}
        <div className="glass-card">
          <div className="card-title">
            <Users size={24} /> Usage Patterns (K-Means Clustering)
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="avg_daily" type="number" name="Avg Daily kWh" stroke="#94a3b8" />
                <YAxis dataKey="max_energy" type="number" name="Max Peak kWh" stroke="#94a3b8" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Scatter name="Low Consumer" data={clusterData?.scatter_data?.filter((d: any) => d.cluster === 'Low Consumer')} fill="#06b6d4" />
                <Scatter name="Medium Consumer" data={clusterData?.scatter_data?.filter((d: any) => d.cluster === 'Medium Consumer')} fill="#6366f1" />
                <Scatter name="High Consumer" data={clusterData?.scatter_data?.filter((d: any) => d.cluster === 'High Consumer')} fill="#ec4899" />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Summary */}
        <div className="glass-card">
          <div className="card-title">Optimization Insights</div>
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            {clusterData?.summary?.map((cluster: any) => (
              <div key={cluster.cluster_label} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${cluster.cluster_label === 'High Consumer' ? '#ec4899' : cluster.cluster_label === 'Medium Consumer' ? '#6366f1' : '#06b6d4'}` }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{cluster.cluster_label} Segment ({cluster.count} homes)</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                  Averages <strong>{cluster.avg_daily_energy.toFixed(2)} kWh/day</strong> with peaks up to {cluster.avg_max_energy.toFixed(2)} kWh.
                </p>
                {cluster.cluster_label === 'High Consumer' && (
                  <p style={{ margin: '0.5rem 0 0 0', color: '#ec4899', fontSize: '0.9rem' }}>Insight: Prime candidates for Time-of-Use tariffs and solar+battery adoption.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
