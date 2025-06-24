"use client"

import { useState } from "react"
import { ThemeProvider, useTheme } from "./components/theme-provider"
import { ImprovedLanding } from "./components/improved-landing"
import { ImprovedSidebar } from "./components/improved-sidebar"
import { DashboardOverview } from "./components/dashboard-overview"
import { CompanyScreener } from "./components/company-screener"
import { CompanyDetails } from "./components/company-details"
import { ESGMetrics } from "./components/esg-metrics"
import { Analytics } from "./components/analytics"
import { Portfolio } from "./components/portfolio"
import { Trends } from "./components/trends"
import { ProfilePage } from "./components/profile-page"
import { AuthDialog } from "./components/auth-dialog"
import { SettingsDialog } from "./components/settings-dialog"

function PlatformContent() {
  const { theme } = useTheme()
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "profile">("landing")
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [portfolioCompanies, setPortfolioCompanies] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  const handleSearch = (query: string) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }
    setCurrentView("dashboard")
    setActiveSection("screener")
  }

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }
    setCurrentView("dashboard")
    setActiveSection("overview")
  }

  const handleSignIn = () => {
    setShowAuthDialog(true)
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setUserEmail("user@example.com")
    setCurrentView("dashboard")
    setActiveSection("overview")
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setUserEmail("")
    setCurrentView("landing")
    setPortfolioCompanies([])
    setShowSettingsDialog(false)
  }

  const handleProfileClick = () => {
    setCurrentView("profile")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
  }

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company)
    setActiveSection("company-details")
  }

  const handleBackToScreener = () => {
    setSelectedCompany(null)
    setActiveSection("screener")
  }

  const handleAddToPortfolio = (company: any) => {
    if (!portfolioCompanies.some((c) => c["Company name"] === company["Company name"])) {
      setPortfolioCompanies((prev) => [...prev, company])
    }
  }

  const handleRemoveFromPortfolio = (companyName: string) => {
    setPortfolioCompanies((prev) => prev.filter((company) => company["Company name"] !== companyName))
  }

  if (currentView === "landing") {
    return (
      <>
        <ImprovedLanding onSearch={handleSearch} onGetStarted={handleGetStarted} onSignIn={handleSignIn} />
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} onAuthSuccess={handleAuthSuccess} />
      </>
    )
  }

  if (currentView === "profile") {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
        <div className="p-8">
          <ProfilePage onBack={handleBackToDashboard} userEmail={userEmail} />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}>
      <ImprovedSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onSettingsClick={() => setShowSettingsDialog(true)}
        onProfileClick={handleProfileClick}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "screener" && !selectedCompany && (
            <CompanyScreener onCompanySelect={handleCompanySelect} onAddToPortfolio={handleAddToPortfolio} />
          )}
          {activeSection === "company-details" && selectedCompany && (
            <CompanyDetails company={selectedCompany} onBack={handleBackToScreener} />
          )}
          {activeSection === "analytics" && <Analytics />}
          {activeSection === "esg-metrics" && <ESGMetrics />}
          {activeSection === "portfolio" && (
            <Portfolio portfolioCompanies={portfolioCompanies} onRemoveFromPortfolio={handleRemoveFromPortfolio} />
          )}
          {activeSection === "trends" && <Trends />}
        </div>
      </main>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} onAuthSuccess={handleAuthSuccess} />
      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} onSignOut={handleSignOut} />
    </div>
  )
}

export default function ESGPlatform() {
  return (
    <ThemeProvider>
      <PlatformContent />
    </ThemeProvider>
  )
}
