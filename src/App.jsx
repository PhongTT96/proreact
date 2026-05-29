import { useCallback, useState } from 'react'
import './App.css'
import { Footer } from './components/Footer'
import { PullToRefresh } from './components/PullToRefresh'
import { runPullRefresh } from './lib/pullRefreshRegistry'
import { hasGoogleOAuthHash } from './lib/googleOAuthRedirect'
import { HomePage } from './pages/HomePage'
import { DetailPage } from './pages/DetailPage'
import { Electronics } from './pages/Electronics'
import { Clothing } from './pages/Clothing'
import { About } from './pages/About'
import { GoogleDrivePage } from './pages/GoogleDrivePage'

const PULL_REFRESH_PAGES = new Set(['home', 'drive'])

function getInitialPage() {
  if (typeof window !== 'undefined' && hasGoogleOAuthHash()) {
    return sessionStorage.getItem('google_oauth_return_page') || 'drive'
  }
  return 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage)

  const handlePullRefresh = useCallback(async () => {
    await runPullRefresh(currentPage)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'Electronics':
        return <Electronics onBack={() => setCurrentPage('home')} />
      case 'Clothing':
        return <Clothing onBack={() => setCurrentPage('home')} />
      case 'About':
        return <About onBack={() => setCurrentPage('home')} />
      case 'drive':
        return <GoogleDrivePage onBack={() => setCurrentPage('home')} />
      case 'detail':
        return <DetailPage onBack={() => setCurrentPage('home')} />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <main className="main-content">
          <PullToRefresh onRefresh={handlePullRefresh} disabled={!PULL_REFRESH_PAGES.has(currentPage)}>
            {renderPage()}
          </PullToRefresh>
        </main>
      </div>
      <Footer currentPage={currentPage} onTabChange={setCurrentPage} />
    </div>
  )
}

export default App
