import { useState } from 'react'
import './App.css'
import { Menu } from './components/Menu'
import { menuData } from './data/menus'
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
    <div className="app-container">
      <Menu items={menuData} onMenuClick={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
