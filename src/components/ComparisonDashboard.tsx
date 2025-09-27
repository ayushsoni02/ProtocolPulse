'use client';

import { useState, useEffect } from 'react';
import { HealthComparison, ProtocolHealth } from '@/lib/types';
import ProtocolCard from './ProtocolCard';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

export default function ComparisonDashboard() {
  const [data, setData] = useState<HealthComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/health?protocols=uniswap,sushiswap');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const healthData: HealthComparison = await response.json();
      setData(healthData);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHealthData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchHealthData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchHealthData();
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Protocol Health Comparison</h2>
          <p className="text-gray-600">
            Real-time analysis of DeFi protocol health based on user behavior patterns
          </p>
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✓ Connected to The Graph Protocol</strong> - Analyzing real DeFi protocol data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <div className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Health Score Comparison */}
      {data && !isLoading && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Health Score Comparison</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                Uniswap: {data.uniswap.overallScore}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                data.uniswap.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                data.uniswap.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Grade {data.uniswap.grade}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                SushiSwap: {data.sushiswap.overallScore}
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                data.sushiswap.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                data.sushiswap.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Grade {data.sushiswap.grade}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              {data.uniswap.overallScore > data.sushiswap.overallScore ? (
                <span className="text-green-700 font-semibold">
                  Uniswap is currently healthier than SushiSwap
                </span>
              ) : data.sushiswap.overallScore > data.uniswap.overallScore ? (
                <span className="text-green-700 font-semibold">
                  SushiSwap is currently healthier than Uniswap
                </span>
              ) : (
                <span className="text-blue-700 font-semibold">
                  Both protocols have similar health scores
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Protocol Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtocolCard 
          protocol={data?.uniswap || {} as ProtocolHealth} 
          isLoading={isLoading} 
        />
        <ProtocolCard 
          protocol={data?.sushiswap || {} as ProtocolHealth} 
          isLoading={isLoading} 
        />
      </div>

      {/* Loading State */}
      {isLoading && !data && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Analyzing protocol health data...</p>
        </div>
      )}
    </div>
  );
}
