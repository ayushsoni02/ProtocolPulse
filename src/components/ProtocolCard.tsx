'use client';

import { ProtocolHealth } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Activity, Users, DollarSign, Zap } from 'lucide-react';

interface ProtocolCardProps {
  protocol: ProtocolHealth;
  isLoading?: boolean;
}

export default function ProtocolCard({ protocol, isLoading }: ProtocolCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

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

  const formatProtocolName = (protocolName: string) => {
    return protocolName.charAt(0).toUpperCase() + protocolName.slice(1);
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border-2 ${getHealthBgColor(protocol.overallScore)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {formatProtocolName(protocol.protocol)}
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getHealthColor(protocol.overallScore)}`}>
          Grade {protocol.grade}
        </div>
      </div>

      {/* Main Health Score */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {protocol.overallScore}
        </div>
        <div className="flex items-center justify-center gap-2">
          {getTrendIcon(protocol.trend)}
          <span className="text-sm text-gray-600 capitalize">
            {protocol.trend}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">User Retention</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {protocol.metrics.userRetention.score}%
            </div>
            <div className="text-xs text-gray-500">
              {protocol.metrics.userRetention.details.description}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Volume Stability</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {protocol.metrics.volumeStability.score}%
            </div>
            <div className="text-xs text-gray-500">
              {protocol.metrics.volumeStability.details.description}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Activity Trend</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {protocol.metrics.activityTrend.score > 0 ? '+' : ''}{protocol.metrics.activityTrend.score}
            </div>
            <div className="text-xs text-gray-500">
              {protocol.metrics.activityTrend.details.description}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Technical Health</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {protocol.metrics.technicalHealth.score}%
            </div>
            <div className="text-xs text-gray-500">
              {protocol.metrics.technicalHealth.details.description}
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(protocol.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
