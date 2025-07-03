"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
} from "recharts"
import { Company } from "@/types"

interface AnalyticsProps {
  portfolioCompanies: Company[]
}

// Helper function to calculate total portfolio value
const calculateTotalPortfolioValue = (companies: Company[]) => {
  return companies.reduce((sum, company) => sum + (company.currentPrice || 0) * (company.shares || 0), 0)
}

// Helper function to calculate total return (simplified for now)
const calculateTotalReturn = (companies: Company[]) => {
  const initialValue = companies.reduce((sum, company) => sum + (company.avgPrice || 0) * (company.shares || 0), 0)
  const currentValue = calculateTotalPortfolioValue(companies)
  if (initialValue === 0) return 0
  return ((currentValue - initialValue) / initialValue) * 100
}

// Helper function to calculate average ESG score
const calculateAverageEsgScore = (companies: Company[]) => {
  if (companies.length === 0) return 0
  const totalEsgScore = companies.reduce((sum, company) => sum + company.esgScore, 0)
  return totalEsgScore / companies.length
}

// Helper function to generate performance data (mock for now, needs historical data)
const generatePerformanceData = () => {
  // In a real application, this would fetch or calculate historical performance
  // For now, returning a static mock to avoid breaking the chart
  return [
    { month: "Jan", portfolio: 100, benchmark: 100, esgFactor: 102 },
    { month: "Feb", portfolio: 105, benchmark: 103, esgFactor: 108 },
    { month: "Mar", portfolio: 98, benchmark: 101, esgFactor: 104 },
    { month: "Apr", portfolio: 112, benchmark: 106, esgFactor: 115 },
    { month: "May", portfolio: 118, benchmark: 109, esgFactor: 122 },
    { month: "Jun", portfolio: 125, benchmark: 112, esgFactor: 128 },
  ]
}

// Helper function to generate risk-return data
const generateRiskReturnData = (companies: Company[]) => {
  if (companies.length === 0) return []

  const portfolioRisk = companies.reduce((sum, company) => sum + company.riskRating, 0) / companies.length
  const portfolioReturn = calculateTotalReturn(companies)

  return [
    { risk: 12, return: 8.5, name: "Conservative ESG" },
    { risk: 18, return: 12.2, name: "Balanced ESG" },
    { risk: 25, return: 15.8, name: "Growth ESG" },
    { risk: 32, return: 18.5, name: "Aggressive ESG" },
    { risk: parseFloat(portfolioRisk.toFixed(2)), return: parseFloat(portfolioReturn.toFixed(2)), name: "Your Portfolio" },
  ]
}

// Helper function to generate sector allocation data
const generateSectorAllocation = (companies: Company[]) => {
  const sectorMap = new Map<string, { allocation: number; performance: number }>()

  companies.forEach(company => {
    const sector = company.industryGroup || "Other"
    const value = (company.currentPrice || 0) * (company.shares || 0)
    const esgScore = company.esgScore || 0 // Using ESG score as a proxy for performance for now

    if (sectorMap.has(sector)) {
      const existing = sectorMap.get(sector)!
      sectorMap.set(sector, {
        allocation: existing.allocation + value,
        performance: existing.performance + esgScore,
      })
    } else {
      sectorMap.set(sector, { allocation: value, performance: esgScore })
    }
  })

  const totalValue = Array.from(sectorMap.values()).reduce((sum, s) => sum + s.allocation, 0)

  return Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    allocation: totalValue === 0 ? 0 : (data.allocation / totalValue) * 100,
    performance: data.performance / companies.filter(c => c.industryGroup === sector).length || 0,
  }))
}

// Helper function to generate ESG factor correlation data
const generateCorrelationData = (companies: Company[]) => {
  // This is a placeholder. Real correlation requires statistical analysis
  // of historical ESG metrics vs. portfolio performance.
  // For demonstration, we'll use a simplified approach or mock data.

  if (companies.length === 0) return []

  // Example: Calculate a very basic 'correlation' based on average ESG score and total return
  const avgEsg = calculateAverageEsgScore(companies)
  const totalRet = calculateTotalReturn(companies)

  // This is a highly simplified and not statistically accurate correlation.
  // A real implementation would involve more complex calculations.
  const esgPerformanceCorrelation = avgEsg > 70 && totalRet > 10 ? 0.85 : (avgEsg < 50 && totalRet < 0 ? -0.7 : 0.4)

  return [
    { metric: "ESG Score", correlation: parseFloat(esgPerformanceCorrelation.toFixed(2)), significance: "High" },
    { metric: "Carbon Intensity", correlation: -0.65, significance: "High" }, // Mock
    { metric: "Board Diversity", correlation: 0.42, significance: "Medium" }, // Mock
    { metric: "Employee Satisfaction", correlation: 0.58, significance: "High" }, // Mock
    { metric: "Governance Rating", correlation: 0.71, significance: "High" }, // Mock
  ]
}

export function Analytics({ portfolioCompanies }: AnalyticsProps) {
  const totalPortfolioValue = calculateTotalPortfolioValue(portfolioCompanies);
  const totalReturn = calculateTotalReturn(portfolioCompanies);
  const averageEsgScore = calculateAverageEsgScore(portfolioCompanies);
  const esgAlpha = totalReturn - 0.08; // Example: Assuming a benchmark return of 8%

  const performanceData = generatePerformanceData();
  const riskReturnData = generateRiskReturnData(portfolioCompanies);
  const sectorAllocation = generateSectorAllocation(portfolioCompanies);
  const correlationData = generateCorrelationData(portfolioCompanies);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Advanced portfolio analysis and insights</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Return</p>
                <p className="text-2xl font-bold text-green-400">+25.3%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">vs benchmark +12.1%</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-blue-400">1.84</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Risk-adjusted return</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-400">-8.2%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Peak to trough</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">ESG Alpha</p>
                <p className="text-2xl font-bold text-purple-400">+4.8%</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">ESG-driven outperformance</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Performance Analysis</CardTitle>
          <p className="text-gray-400 text-sm">Portfolio vs benchmark vs ESG factor performance</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="portfolio" stroke="#10b981" strokeWidth={3} name="Your Portfolio" />
              <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} name="Benchmark" />
              <Line type="monotone" dataKey="esgFactor" stroke="#8b5cf6" strokeWidth={2} name="ESG Factor" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk-Return Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Risk-Return Profile</CardTitle>
            <p className="text-gray-400 text-sm">Portfolio positioning vs ESG strategies</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={riskReturnData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="risk" stroke="#9ca3af" name="Risk %" />
                <YAxis dataKey="return" stroke="#9ca3af" name="Return %" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value, name) => [
                    `${value}${name === "risk" ? "%" : "%"}`,
                    name === "risk" ? "Risk" : "Return",
                  ]}
                />
                <Scatter dataKey="return" fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sector Performance</CardTitle>
            <p className="text-gray-400 text-sm">Allocation vs performance by sector</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorAllocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="sector" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="allocation" fill="#3b82f6" name="Allocation %" />
                <Bar dataKey="performance" fill="#10b981" name="Performance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ESG Correlation Analysis */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">ESG Factor Correlation</CardTitle>
          <p className="text-gray-400 text-sm">Correlation between ESG metrics and portfolio performance</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlationData.map((item: { metric: string; correlation: number; significance: string }, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white font-medium">{item.metric}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      item.significance === "High"
                        ? "bg-green-900/20 text-green-400"
                        : "bg-yellow-900/20 text-yellow-400"
                    }
                  >
                    {item.significance}
                  </Badge>
                  <span className={`font-mono text-lg ${item.correlation > 0 ? "text-green-400" : "text-red-400"}`}>
                    {item.correlation > 0 ? "+" : ""}
                    {item.correlation.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">Strong ESG Alpha</p>
                <p className="text-gray-300 text-sm">Your ESG-focused strategy is generating 4.8% alpha</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Optimal Risk-Return</p>
                <p className="text-gray-300 text-sm">Portfolio positioned well on the efficient frontier</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-purple-400 font-medium">ESG Premium</p>
                <p className="text-gray-300 text-sm">High ESG scores correlate with better returns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Rebalance Technology</p>
                <p className="text-gray-300 text-sm">Consider reducing tech allocation from 35% to 30%</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">Increase ESG Leaders</p>
                <p className="text-gray-300 text-sm">Add more companies with ESG scores above 80</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Diversify Geography</p>
                <p className="text-gray-300 text-sm">Consider adding European ESG leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
