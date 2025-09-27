'use client';

import { ProtocolHealth } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Activity, Zap } from 'lucide-react';

interface HealthMetricsProps {
  protocol: ProtocolHealth;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function HealthMetrics({ protocol, isExpanded = false, onToggle }: HealthMetricsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const metrics = [
    {
      key: 'userRetention',
      icon: Users,
      title: 'User Retention',
      score: protocol.metrics.userRetention.score,
      trend: protocol.metrics.userRetention.details.trend,
      description: protocol.metrics.userRetention.details.description,
      details: `Retention Rate: ${protocol.metrics.userRetention.details.value.toFixed(1)}%`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'volumeStability',
      icon: DollarSign,
      title: 'Volume Stability',
      score: protocol.metrics.volumeStability.score,
      trend: protocol.metrics.volumeStability.details.trend,
      description: protocol.metrics.volumeStability.details.description,
      details: `Coefficient of Variation: ${protocol.metrics.volumeStability.details.value.toFixed(3)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'activityTrend',
      icon: Activity,
      title: 'Activity Trend',
      score: protocol.metrics.activityTrend.score,
      trend: protocol.metrics.activityTrend.details.trend,
      description: protocol.metrics.activityTrend.details.description,
      details: `Growth Rate: ${protocol.metrics.activityTrend.details.value.toFixed(1)}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      key: 'technicalHealth',
      icon: Zap,
      title: 'Technical Health',
      score: protocol.metrics.technicalHealth.score,
      trend: protocol.metrics.technicalHealth.details.trend,
      description: protocol.metrics.technicalHealth.details.description,
      details: `Average Gas: ${parseInt(protocol.metrics.technicalHealth.details.value.toString()).toLocaleString()}`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Detailed Health Metrics</h3>
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.key} className={`${metric.bgColor} rounded-lg p-4 border border-gray-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                <div>
                  <h4 className="font-semibold text-gray-900">{metric.title}</h4>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.key === 'activityTrend' && metric.score > 0 ? '+' : ''}{metric.score}
                  {metric.key !== 'activityTrend' && '%'}
                </span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">{metric.details}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Trend:</span>
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)} capitalize`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.score >= 80 ? 'bg-green-500' :
                    metric.score >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, metric.score))}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Health Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">Overall Health Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Overall Score:</span>
            <span className="ml-2 font-semibold text-gray-900">{protocol.overallScore}/100</span>
          </div>
          <div>
            <span className="text-gray-600">Grade:</span>
            <span className="ml-2 font-semibold text-gray-900">{protocol.grade}</span>
          </div>
          <div>
            <span className="text-gray-600">Trend:</span>
            <span className={`ml-2 font-semibold ${getTrendColor(protocol.trend)} capitalize`}>
              {protocol.trend}
            </span>
          </div>
        </div>
        
        {/* Health Interpretation */}
        <div className="mt-3 p-3 bg-white rounded border">
          <p className="text-sm text-gray-700">
            {protocol.overallScore >= 80 ? (
              <span className="text-green-700">
                <strong>Healthy:</strong> This protocol shows strong user retention, stable volume patterns, and positive activity trends.
              </span>
            ) : protocol.overallScore >= 60 ? (
              <span className="text-yellow-700">
                <strong>Caution:</strong> This protocol shows mixed signals. Monitor closely for changes in user behavior or volume patterns.
              </span>
            ) : (
              <span className="text-red-700">
                <strong>Avoid:</strong> This protocol shows concerning patterns including low user retention or unstable volume.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
