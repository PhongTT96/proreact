import { useState } from 'react'
import './App.css'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { DetailPage } from './pages/DetailPage'
import { Electronics } from './pages/Electronics'
import { Clothing } from './pages/Clothing'
import { About } from './pages/About'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

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
          {renderPage()}
        </main>
      </div>
      <Footer currentPage={currentPage} onTabChange={setCurrentPage} />
    </div>
  )
}

export default App
