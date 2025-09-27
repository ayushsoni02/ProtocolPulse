export interface SwapTransaction {
  id: string;
  timestamp: string;
  user: string;
  amountUSD: string;
  gasUsed: string;
  protocol: 'uniswap' | 'sushiswap';
}

export interface DailyStats {
  date: string;
  volumeUSD: number;
  txCount: number;
  uniqueUsers: number;
}

export interface HealthMetric {
  score: number;
  details: {
    value: number;
    trend: 'improving' | 'stable' | 'declining';
    description: string;
  };
}

export interface ProtocolHealth {
  protocol: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: {
    userRetention: HealthMetric;
    volumeStability: HealthMetric;
    activityTrend: HealthMetric;
    technicalHealth: HealthMetric;
  };
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
}

export interface HealthComparison {
  uniswap: ProtocolHealth;
  sushiswap: ProtocolHealth;
  lastUpdated: string;
}
