"use client"

import { useState } from "react"
import { AuroraBackground } from "./components/aurora-background"
import { SearchBar } from "./components/search-bar"
import { CompanyCard } from "./components/company-card"
import { ComparisonSection } from "./components/comparison-section"

// Sample data
const sampleCompanyData = {
  "Company name": "1-800-FLOWERS.COM, Inc.",
  "Industry group": "Retailing",
  Country: "United States of America",
  "Risk rating score": "28.9",
  "Risk rating assessment": "Medium Risk",
  "Industry group position": "432",
  "Industry group positions total": "450",
  "Universe position": "9143",
  "Universe positions total": "14689",
  "Company description":
    "1-800-Flowers.com Inc is a provider of gifts designed to help customers express, connect, and celebrate. The company operates through three segments: Consumer Floral & Gifts, Gourmet Foods & Gift Baskets, and BloomNet. The Consumer Floral & Gifts segment provides a range of products, including fresh flowers, live and blooming plants, gifts, food, chocolates and gift baskets, balloons, candles, fresh fruits, and plush and stuffed animals.",
}

export default function ESGDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof sampleCompanyData | null>(null)
  const [error, setError] = useState("")
  const [starredCompanies, setStarredCompanies] = useState<(typeof sampleCompanyData)[]>([])
  const [isCurrentStarred, setIsCurrentStarred] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (searchQuery.toLowerCase().includes("flowers") || searchQuery.toLowerCase().includes("1-800")) {
        setSearchResults(sampleCompanyData)
        setIsCurrentStarred(
          starredCompanies.some((company) => company["Company name"] === sampleCompanyData["Company name"]),
        )
      } else {
        setSearchResults(null)
        setError("Company not found. Please try another name.")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleStar = () => {
    if (!searchResults) return

    if (isCurrentStarred) {
      setStarredCompanies((prev) => prev.filter((company) => company["Company name"] !== searchResults["Company name"]))
      setIsCurrentStarred(false)
    } else {
      setStarredCompanies((prev) => [...prev, searchResults])
      setIsCurrentStarred(true)
    }
  }

  const handleCompare = () => {
    if (!searchResults) return

    if (!starredCompanies.some((company) => company["Company name"] === searchResults["Company name"])) {
      setStarredCompanies((prev) => [...prev, searchResults])
      setIsCurrentStarred(true)
    }
  }

  const handleRemoveFromComparison = (index: number) => {
    const removedCompany = starredCompanies[index]
    setStarredCompanies((prev) => prev.filter((_, i) => i !== index))

    if (searchResults && removedCompany["Company name"] === searchResults["Company name"]) {
      setIsCurrentStarred(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white relative overflow-hidden">
      <AuroraBackground />

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
            ESG Risk Analytics Dashboard
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Search for a company to analyze its Sustainalytics ESG risk profile and make informed investment decisions.
          </h2>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} isLoading={isLoading} />

        {error && <p className="mt-6 text-pink-400 text-lg font-semibold">{error}</p>}
      </div>

      {/* Results Section */}
      {searchResults && (
        <div className="relative z-10 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <CompanyCard
              data={searchResults}
              isStarred={isCurrentStarred}
              onStar={handleStar}
              onCompare={handleCompare}
            />
          </div>
        </div>
      )}

      {/* Comparison Section */}
      {starredCompanies.length > 0 && (
        <div className="relative z-10 px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <ComparisonSection companies={starredCompanies} onRemoveCompany={handleRemoveFromComparison} />
          </div>
        </div>
      )}
    </div>
  )
}
