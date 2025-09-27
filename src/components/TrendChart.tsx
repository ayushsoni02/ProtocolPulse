'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { HealthComparison } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendChartProps {
  data: HealthComparison;
  height?: number;
}

interface ChartDataPoint {
  date: string;
  uniswapScore: number;
  sushiswapScore: number;
  uniswapVolume: number;
  sushiswapVolume: number;
}

export default function TrendChart({ data, height = 300 }: TrendChartProps) {
  // Generate mock trend data for the last 7 days
  // In a real implementation, this would come from historical API data
  const generateTrendData = (): ChartDataPoint[] => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic trend data based on current scores
      const uniswapBase = data.uniswap.overallScore;
      const sushiswapBase = data.sushiswap.overallScore;
      
      // Add some variance to simulate real trends
      const uniswapVariance = (Math.random() - 0.5) * 10;
      const sushiswapVariance = (Math.random() - 0.5) * 10;
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uniswapScore: Math.max(0, Math.min(100, uniswapBase + uniswapVariance)),
        sushiswapScore: Math.max(0, Math.min(100, sushiswapBase + sushiswapVariance)),
        uniswapVolume: Math.random() * 1000000 + 500000, // Mock volume data
        sushiswapVolume: Math.random() * 800000 + 300000
      });
    }
    
    return days;
  };

  const chartData = generateTrendData();
  
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.dataKey}:</span>
              <span className="text-sm font-semibold text-gray-900">
                {entry.dataKey.includes('Score') 
                  ? `${entry.value.toFixed(1)}` 
                  : `$${(entry.value / 1000000).toFixed(2)}M`
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate trend direction for each protocol
  const getTrendDirection = (scores: number[]) => {
    if (scores.length < 2) return 'stable';
    const recent = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = scores.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    
    if (recent > previous + 2) return 'improving';
    if (recent < previous - 2) return 'declining';
    return 'stable';
  };

  const uniswapTrend = getTrendDirection(chartData.map(d => d.uniswapScore));
  const sushiswapTrend = getTrendDirection(chartData.map(d => d.sushiswapScore));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">7-Day Health Trend</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Uniswap</span>
            {uniswapTrend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
            {uniswapTrend === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-600">SushiSwap</span>
            {sushiswapTrend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
            {sushiswapTrend === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
          </div>
        </div>
      </div>

      {/* Health Score Chart */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Health Scores Over Time</h4>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="uniswapScore" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Uniswap Health Score"
            />
            <Line 
              type="monotone" 
              dataKey="sushiswapScore" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              name="SushiSwap Health Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Trend Chart */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3">Daily Volume Trends</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="uniswapVolume" 
              stackId="1"
              stroke="#3B82F6" 
              fill="#3B82F6"
              fillOpacity={0.3}
              name="Uniswap Volume"
            />
            <Area 
              type="monotone" 
              dataKey="sushiswapVolume" 
              stackId="2"
              stroke="#8B5CF6" 
              fill="#8B5CF6"
              fillOpacity={0.3}
              name="SushiSwap Volume"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Trend Summary</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Uniswap:</span>
            <span className={`ml-2 font-medium capitalize ${
              uniswapTrend === 'improving' ? 'text-green-600' :
              uniswapTrend === 'declining' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {uniswapTrend}
            </span>
          </div>
          <div>
            <span className="text-gray-600">SushiSwap:</span>
            <span className={`ml-2 font-medium capitalize ${
              sushiswapTrend === 'improving' ? 'text-green-600' :
              sushiswapTrend === 'declining' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {sushiswapTrend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
