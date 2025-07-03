"use client"

import { useState, useEffect } from "react"
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

  // Load portfolio data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchPortfolio = async () => {
        try {
          const response = await fetch('/api/portfolio');
          if (response.ok) {
            const data = await response.json();
            setPortfolioCompanies(data);
          }
        } catch (error) {
          console.error('Failed to fetch portfolio data:', error);
        }
      };
      
      fetchPortfolio();
    }
  }, [isAuthenticated]);

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

  const handleAddToPortfolio = async (company: any) => {
    if (!portfolioCompanies.some((c) => c["Company name"] === company["Company name"])) {
      try {
        const response = await fetch('/api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(company),
        });
        
        if (response.ok) {
          const updatedPortfolio = await response.json();
          setPortfolioCompanies(updatedPortfolio);
        }
      } catch (error) {
        console.error('Failed to add company to portfolio:', error);
      }
    }
  }

  const handleRemoveFromPortfolio = async (companyName: string) => {
    try {
      const response = await fetch(`/api/portfolio?companyName=${encodeURIComponent(companyName)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolioCompanies(updatedPortfolio);
      }
    } catch (error) {
      console.error('Failed to remove company from portfolio:', error);
    }
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
          {activeSection === "overview" && <DashboardOverview portfolioCompanies={portfolioCompanies} />}
          {activeSection === "screener" && !selectedCompany && (
            <CompanyScreener onCompanySelect={handleCompanySelect} onAddToPortfolio={handleAddToPortfolio} />
          )}
          {activeSection === "company-details" && selectedCompany && (
            <CompanyDetails company={selectedCompany} onBack={handleBackToScreener} />
          )}
          {activeSection === "analytics" && <Analytics portfolioCompanies={portfolioCompanies} />} 
          {activeSection === "esg-metrics" && <ESGMetrics />}
          {activeSection === "portfolio" && (
            <Portfolio
              portfolioCompanies={portfolioCompanies}
              onRemoveFromPortfolio={handleRemoveFromPortfolio}
            onViewDetails={handleCompanySelect}
            onAddInvestmentClick={() => {
              setCurrentView("dashboard");
              setActiveSection("screener");
            }}
          />
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
