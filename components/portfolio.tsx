"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Percent, Eye, Trash2, Plus, MoreHorizontal, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

interface PortfolioProps {
  portfolioCompanies: any[]
  onRemoveFromPortfolio: (companyName: string) => void
  onViewDetails: (company: any) => void
  onAddInvestmentClick: () => void
}

// Mock data removed, these will be dynamically calculated or fetched
const portfolioPerformance: { month: string; value: number }[] = []

export function Portfolio({
  portfolioCompanies,
  onRemoveFromPortfolio,
  onViewDetails,
  onAddInvestmentClick,
}: PortfolioProps) {
  const [selectedHolding, setSelectedHolding] = useState<any>(null)

  // Calculate portfolio metrics based on actual portfolio data
  // For now, we'll assume each company in the portfolio has a 'value' property
  // In a real application, you would fetch or calculate these values based on shares and current price.
  const holdings = portfolioCompanies.map((company: any) => ({
    ...company,
    // Placeholder values for now, will be replaced with actual data or calculated
    shares: 1, // Assuming 1 share for simplicity
    avgPrice: company["Risk rating score"] || 0, // Using risk score as a placeholder for price
    currentPrice: company["Risk rating score"] || 0, // Using risk score as a placeholder for price
    allocation: 0,
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#6BFF6B', '#6B6BFF'];

  // Calculate sector allocation dynamically
  const sectorAllocationRaw = holdings.reduce((acc: { [key: string]: number }, holding: any) => {
    const sectorName = holding["Industry group"];
    const holdingValue = holding.shares * holding.currentPrice;
    acc[sectorName] = (acc[sectorName] || 0) + holdingValue;
    return acc;
  }, {});

  const totalPortfolioValue = Object.values(sectorAllocationRaw).reduce((sum, value) => sum + value, 0);

  const sectorAllocation = Object.entries(sectorAllocationRaw).map(([name, value], index) => ({
    name,
    value: (value / totalPortfolioValue) * 100, // Convert to percentage
    color: COLORS[index % COLORS.length]
  }));

  // Calculate total portfolio value and returns
  const totalValue = holdings.reduce((sum, holding) => sum + (holding.shares * holding.currentPrice), 0)
  const totalCost = holdings.reduce((sum, holding) => sum + (holding.shares * holding.avgPrice), 0)
  const totalReturn = totalValue - totalCost
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0
  // For now, simulating a small daily change for display purposes
  const dayChange = totalValue * 0.001 // Simulating a 0.1% daily change
  const dayChangePercent = 0.1

  const getReturnColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  const getReturnIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Your ESG investment portfolio overview</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={onAddInvestmentClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {React.createElement(getReturnIcon(dayChange), {
                className: `h-4 w-4 ${getReturnColor(dayChange)}`,
              })}
              <span className={`text-sm ${getReturnColor(dayChange)}`}>
                ${Math.abs(dayChange).toLocaleString()} ({dayChangePercent.toFixed(2)}%) today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Return</p>
                <p className={`text-2xl font-bold ${getReturnColor(totalReturn)}`}>${totalReturn.toLocaleString()}</p>
              </div>
              {React.createElement(getReturnIcon(totalReturn), {
                className: `h-8 w-8 ${getReturnColor(totalReturn)}`,
              })}
            </div>
            <p className={`text-sm ${getReturnColor(totalReturn)} mt-2`}>
              {totalReturnPercent.toFixed(2)}% total return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Holdings</p>
                <p className="text-2xl font-bold text-white">{holdings.length}</p>
              </div>
              <Percent className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Active positions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg ESG Score</p>
                <p className="text-2xl font-bold text-green-400">
                  {(holdings.reduce((sum, holding) => sum + (100 - Number.parseFloat(holding["Risk rating score"] || 0)), 0) / holdings.length || 0).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-sm text-green-400 mt-2">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Performance</CardTitle>
            <p className="text-gray-400 text-sm">6-month performance tracking</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={portfolioPerformance}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Portfolio Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sector Allocation</CardTitle>
            <p className="text-gray-400 text-sm">Portfolio diversification by sector</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sectorAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorAllocation.map((entry: { color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`${value}%`, "Allocation"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Current Holdings</CardTitle>
          <p className="text-gray-400 text-sm">Your active investment positions</p>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No holdings yet</p>
                <p className="text-sm">Add companies to your portfolio to get started</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Company</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Shares</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg Price</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Current Price</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">P&L</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Allocation</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">ESG Score</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding, index) => {
                    const totalCost = holding.shares * holding.avgPrice
                    const currentValue = holding.shares * holding.currentPrice
                    const pnl = currentValue - totalCost
                    const pnlPercent = (pnl / totalCost) * 100
                    const esgScore = Math.max(0, 100 - Number.parseFloat(holding["Risk rating score"]))

                    return (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white font-medium">{holding["Company name"]}</p>
                            <p className="text-gray-400 text-sm">{holding["Industry group"]}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white font-mono">{holding.shares}</td>
                        <td className="py-4 px-4 text-white font-mono">${holding.avgPrice}</td>
                        <td className="py-4 px-4 text-white font-mono">${holding.currentPrice}</td>
                        <td className="py-4 px-4">
                          <div className={`${getReturnColor(pnl)}`}>
                            <p className="font-mono">${Math.abs(pnl).toLocaleString()}</p>
                            <p className="text-sm">({pnlPercent.toFixed(2)}%)</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={holding.allocation} className="w-16 h-2" />
                            <span className="text-white text-sm">{holding.allocation}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              esgScore > 80
                                ? "bg-green-900/20 text-green-400"
                                : esgScore > 60
                                  ? "bg-yellow-900/20 text-yellow-400"
                                  : "bg-red-900/20 text-red-400"
                            }
                          >
                            {esgScore.toFixed(0)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem
                                onClick={() => onViewDetails(holding)}
                                className="text-gray-300 hover:text-white"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRemoveFromPortfolio(holding["Company name"])}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
