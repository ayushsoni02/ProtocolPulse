import { SwapTransaction, ProtocolHealth, HealthMetric } from './types';

export class HealthCalculator {
  calculateProtocolHealth(swaps: SwapTransaction[], protocol: string): ProtocolHealth {
    // 1. User Retention Score (0-100)
    const userRetention = this.calculateUserRetention(swaps);
    
    // 2. Volume Stability Score (0-100)
    const volumeStability = this.calculateVolumeStability(swaps);
    
    // 3. Activity Trend Score (-50 to +50)
    const activityTrend = this.calculateActivityTrend(swaps);
    
    // 4. Technical Health Score (0-100)
    const technicalHealth = this.calculateTechnicalHealth(swaps);
    
    // Weighted Overall Score: retention: 40%, stability: 30%, trend: 20%, technical: 10%
    const overallScore = Math.round(
      (userRetention.score * 0.4) +
      (volumeStability.score * 0.3) +
      ((activityTrend.score + 50) * 0.4) + // Convert -50/+50 to 0-100
      (technicalHealth.score * 0.1)
    );
    
    // Determine grade
    const grade = this.calculateGrade(overallScore);
    
    // Determine overall trend
    const trend = this.calculateOverallTrend([userRetention, volumeStability, activityTrend, technicalHealth]);
    
    return {
      protocol,
      overallScore: Math.max(0, Math.min(100, overallScore)),
      grade,
      metrics: {
        userRetention,
        volumeStability,
        activityTrend,
        technicalHealth
      },
      trend,
      lastUpdated: new Date().toISOString()
    };
  }
  
  private calculateUserRetention(swaps: SwapTransaction[]): HealthMetric {
    // Group swaps by 7-day periods
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);
    
    const recentSwaps = swaps.filter(swap => 
      new Date(parseInt(swap.timestamp) * 1000).getTime() >= sevenDaysAgo
    );
    
    const previousSwaps = swaps.filter(swap => {
      const swapTime = new Date(parseInt(swap.timestamp) * 1000).getTime();
      return swapTime >= fourteenDaysAgo && swapTime < sevenDaysAgo;
    });
    
    // Get unique users for each period
    const recentUsers = new Set(recentSwaps.map(swap => swap.user));
    const previousUsers = new Set(previousSwaps.map(swap => swap.user));
    
    // Find returning users
    const returningUsers = new Set([...recentUsers].filter(user => previousUsers.has(user)));
    
    // Calculate retention rate
    const retentionRate = recentUsers.size > 0 ? (returningUsers.size / recentUsers.size) * 100 : 0;
    
    // Compare with previous period for trend
    const previousRetentionRate = previousUsers.size > 0 ? 
      (returningUsers.size / previousUsers.size) * 100 : 0;
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (retentionRate > previousRetentionRate + 5) {
      trend = 'improving';
    } else if (retentionRate < previousRetentionRate - 5) {
      trend = 'declining';
    }
    
    return {
      score: Math.round(Math.min(100, retentionRate)),
      details: {
        value: retentionRate,
        trend,
        description: `${retentionRate.toFixed(1)}% of users returned`
      }
    };
  }
  
  private calculateVolumeStability(swaps: SwapTransaction[]): HealthMetric {
    // Group swaps by day
    const dailyVolumes: { [key: string]: number } = {};
    
    swaps.forEach(swap => {
      const date = new Date(parseInt(swap.timestamp) * 1000).toISOString().split('T')[0];
      const volume = parseFloat(swap.amountUSD);
      
      if (dailyVolumes[date]) {
        dailyVolumes[date] += volume;
      } else {
        dailyVolumes[date] = volume;
      }
    });
    
    const volumes = Object.values(dailyVolumes);
    
    if (volumes.length === 0) {
      return {
        score: 0,
        details: {
          value: 0,
          trend: 'stable',
          description: 'No volume data available'
        }
      };
    }
    
    // Calculate coefficient of variation
    const mean = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
    const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - mean, 2), 0) / volumes.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / mean;
    
    // Convert to score (lower coefficient = higher score)
    const stabilityScore = Math.max(0, 100 - (coefficientOfVariation * 100));
    
    // Determine trend based on recent vs previous periods
    const sortedDates = Object.keys(dailyVolumes).sort();
    const recentVolumes = sortedDates.slice(-3).map(date => dailyVolumes[date]);
    const previousVolumes = sortedDates.slice(-6, -3).map(date => dailyVolumes[date]);
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentVolumes.length > 0 && previousVolumes.length > 0) {
      const recentAvg = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
      const previousAvg = previousVolumes.reduce((sum, vol) => sum + vol, 0) / previousVolumes.length;
      const change = (recentAvg - previousAvg) / previousAvg;
      
      if (change > 0.1) {
        trend = 'improving';
      } else if (change < -0.1) {
        trend = 'declining';
      }
    }
    
    return {
      score: Math.round(stabilityScore),
      details: {
        value: coefficientOfVariation,
        trend,
        description: `Volume variance: ${coefficientOfVariation.toFixed(3)}`
      }
    };
  }
  
  private calculateActivityTrend(swaps: SwapTransaction[]): HealthMetric {
    // Compare recent 3 days vs previous 3 days
    const now = Date.now();
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = now - (6 * 24 * 60 * 60 * 1000);
    
    const recentSwaps = swaps.filter(swap => 
      new Date(parseInt(swap.timestamp) * 1000).getTime() >= threeDaysAgo
    );
    
    const previousSwaps = swaps.filter(swap => {
      const swapTime = new Date(parseInt(swap.timestamp) * 1000).getTime();
      return swapTime >= sixDaysAgo && swapTime < threeDaysAgo;
    });
    
    // Calculate metrics
    const recentUsers = new Set(recentSwaps.map(swap => swap.user)).size;
    const recentVolume = recentSwaps.reduce((sum, swap) => sum + parseFloat(swap.amountUSD), 0);
    const recentTxCount = recentSwaps.length;
    
    const previousUsers = new Set(previousSwaps.map(swap => swap.user)).size;
    const previousVolume = previousSwaps.reduce((sum, swap) => sum + parseFloat(swap.amountUSD), 0);
    const previousTxCount = previousSwaps.length;
    
    // Calculate growth rates
    const userGrowth = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers) * 100 : 0;
    const volumeGrowth = previousVolume > 0 ? ((recentVolume - previousVolume) / previousVolume) * 100 : 0;
    const txGrowth = previousTxCount > 0 ? ((recentTxCount - previousTxCount) / previousTxCount) * 100 : 0;
    
    // Average growth rate
    const avgGrowth = (userGrowth + volumeGrowth + txGrowth) / 3;
    
    // Convert to -50 to +50 scale
    const trendScore = Math.max(-50, Math.min(50, avgGrowth * 2));
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (trendScore > 10) {
      trend = 'improving';
    } else if (trendScore < -10) {
      trend = 'declining';
    }
    
    return {
      score: Math.round(trendScore),
      details: {
        value: avgGrowth,
        trend,
        description: `${avgGrowth.toFixed(1)}% growth rate`
      }
    };
  }
  
  private calculateTechnicalHealth(swaps: SwapTransaction[]): HealthMetric {
    if (swaps.length === 0) {
      return {
        score: 0,
        details: {
          value: 0,
          trend: 'stable',
          description: 'No transaction data'
        }
      };
    }
    
    // Calculate average gas costs
    const gasCosts = swaps.map(swap => parseInt(swap.gasUsed));
    const avgGasCost = gasCosts.reduce((sum, gas) => sum + gas, 0) / gasCosts.length;
    
    // Gas efficiency score (lower gas = higher score)
    // Assuming 100k gas is optimal, score decreases as gas increases
    const gasEfficiencyScore = Math.max(0, 100 - ((avgGasCost - 100000) / 10000));
    
    // Transaction success rate (assuming all returned transactions are successful)
    const successRate = 100; // Since we only get successful transactions from the subgraph
    
    // Combined technical score
    const technicalScore = (gasEfficiencyScore * 0.7) + (successRate * 0.3);
    
    // Determine trend (compare recent vs previous gas costs)
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    const recentSwaps = swaps.filter(swap => 
      new Date(parseInt(swap.timestamp) * 1000).getTime() >= sevenDaysAgo
    );
    
    const previousSwaps = swaps.filter(swap => 
      new Date(parseInt(swap.timestamp) * 1000).getTime() < sevenDaysAgo
    );
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentSwaps.length > 0 && previousSwaps.length > 0) {
      const recentAvgGas = recentSwaps.reduce((sum, swap) => sum + parseInt(swap.gasUsed), 0) / recentSwaps.length;
      const previousAvgGas = previousSwaps.reduce((sum, swap) => sum + parseInt(swap.gasUsed), 0) / previousSwaps.length;
      
      if (recentAvgGas < previousAvgGas * 0.9) {
        trend = 'improving';
      } else if (recentAvgGas > previousAvgGas * 1.1) {
        trend = 'declining';
      }
    }
    
    return {
      score: Math.round(Math.min(100, technicalScore)),
      details: {
        value: avgGasCost,
        trend,
        description: `Avg gas: ${avgGasCost.toLocaleString()}`
      }
    };
  }
  
  private calculateGrade(score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 55) return 'D';
    return 'F';
  }
  
  private calculateOverallTrend(metrics: HealthMetric[]): 'improving' | 'stable' | 'declining' {
    const improvingCount = metrics.filter(m => m.details.trend === 'improving').length;
    const decliningCount = metrics.filter(m => m.details.trend === 'declining').length;
    
    if (improvingCount > decliningCount) return 'improving';
    if (decliningCount > improvingCount) return 'declining';
    return 'stable';
  }
}
