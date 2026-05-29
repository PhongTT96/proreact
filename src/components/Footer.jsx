export function Footer({ currentPage, onTabChange }) {
  return (
    <footer className="app-footer">
      <nav className="footer-nav">
        <button
          type="button"
          className={`footer-nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          Trang chủ
        </button>
        <button
          type="button"
          className={`footer-nav-btn ${currentPage === 'Electronics' ? 'active' : ''}`}
          onClick={() => onTabChange('Electronics')}
        >
          Điện tử
        </button>
        <button
          type="button"
          className={`footer-nav-btn ${currentPage === 'Clothing' ? 'active' : ''}`}
          onClick={() => onTabChange('Clothing')}
        >
          Quần áo
        </button>
        <button
          type="button"
          className={`footer-nav-btn ${currentPage === 'drive' ? 'active' : ''}`}
          onClick={() => onTabChange('drive')}
        >
          Drive
        </button>
        <button
          type="button"
          className={`footer-nav-btn ${currentPage === 'About' ? 'active' : ''}`}
          onClick={() => onTabChange('About')}
        >
          Giới thiệu
        </button>
      </nav>
    </footer>
  )
}
