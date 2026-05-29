import { useState } from 'react'

export function Menu({ items, onMenuClick }) {
  const [expandedMenus, setExpandedMenus] = useState({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleMenuClick = (item) => {
    if (item.submenu) {
      toggleSubmenu(item.id)
    } else if (item.page) {
      onMenuClick(item.page)
      setMobileMenuOpen(false) // Close menu on page select (mobile)
    }
  }

  const renderMenuItem = (item, level = 0) => (
    <li key={item.id} className={`menu-item level-${level}`}>
      <button
        className={`menu-button ${expandedMenus[item.id] ? 'expanded' : ''}`}
        onClick={() => handleMenuClick(item)}
      >
        <span>{item.label}</span>
        {item.submenu && (
          <span className="submenu-toggle">
            {expandedMenus[item.id] ? '▼' : '▶'}
          </span>
        )}
      </button>
      {item.submenu && expandedMenus[item.id] && (
        <ul className="submenu">
          {item.submenu.map(subitem => renderMenuItem(subitem, level + 1))}
        </ul>
      )}
    </li>
  )

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu */}
      <nav className={`menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="menu-list">
          {items.map(item => renderMenuItem(item))}
        </ul>
      </nav>
    </>
  )
}

