'use client';

import ComparisonDashboard from '@/components/ComparisonDashboard';
import TrendChart from '@/components/TrendChart';
import { useState, useEffect } from 'react';
import { HealthComparison } from '@/lib/types';
import { Shield, TrendingUp, Users, AlertTriangle, Info } from 'lucide-react';

export default function Home() {
  const [healthData, setHealthData] = useState<HealthComparison | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/health?protocols=uniswap,sushiswap');
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-12 h-12 text-blue-200" />
              <h1 className="text-5xl font-bold">ProtocolPulse</h1>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-blue-100">
              Real-Time Protocol Health Analysis
            </h2>
            
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              See which DeFi protocols are actually healthy vs just hyped. 
              Analyze user behavior patterns to predict protocol health before problems become obvious.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <TrendingUp className="w-8 h-8 text-blue-200 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Predictive Analysis</h3>
                <p className="text-sm text-blue-100">
                  Spot protocol problems weeks before traditional metrics show them
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <Users className="w-8 h-8 text-blue-200 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">User Behavior</h3>
                <p className="text-sm text-blue-100">
                  Analyze retention, volume stability, and activity trends from real data
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <AlertTriangle className="w-8 h-8 text-blue-200 mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Early Warning</h3>
                <p className="text-sm text-blue-100">
                  Get alerts about declining protocol health before it impacts your investments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="container mx-auto px-4 py-12">
        <ComparisonDashboard />
      </section>

      {/* Trend Analysis */}
      {healthData && (
        <section className="container mx-auto px-4 py-12">
          <TrendChart data={healthData} />
        </section>
      )}

      {/* What This Means Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why This Matters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Early Detection
                    </h3>
                    <p className="text-gray-600">
                      Traditional metrics like TVL and price often lag behind actual protocol health. 
                      Our behavioral analysis catches problems weeks earlier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      User Retention Patterns
                    </h3>
                    <p className="text-gray-600">
                      Healthy protocols retain users across time periods. Declining retention 
                      often precedes major protocol issues or exploits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Volume Stability
                    </h3>
                    <p className="text-gray-600">
                      Stable volume patterns indicate consistent user trust and protocol reliability. 
                      High volatility often signals underlying problems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Real Examples
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium text-gray-900">Protocol A (Declining)</h4>
                      <p className="text-sm text-gray-600">
                        User retention dropped from 45% to 12% over 2 weeks before 
                        a major exploit was discovered.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium text-gray-900">Protocol B (Caution)</h4>
                      <p className="text-sm text-gray-600">
                        Volume variance increased 300% before liquidity issues 
                        became apparent to the public.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-900">Protocol C (Healthy)</h4>
                      <p className="text-sm text-gray-600">
                        Consistent 60%+ user retention and stable volume patterns 
                        predicted long-term protocol success.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">
                      How It Works
                    </h3>
                  </div>
                  <p className="text-blue-800 text-sm">
                    We analyze real transaction data from The Graph Protocol, focusing on 
                    user retention, volume stability, activity trends, and technical health. 
                    No AI or machine learning - just mathematical analysis of behavioral patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold">ProtocolPulse</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Real-time DeFi protocol health analysis powered by The Graph Protocol
            </p>
            <div className="text-sm text-gray-500">
              <p>Data updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}</p>
              <p className="mt-2">
                Built with Next.js, Apollo GraphQL, and The Graph Protocol
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}