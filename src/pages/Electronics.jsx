export function Electronics({ onBack }) {
  return (
    <div className="App">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1>Điện tử</h1>
      </header>
      <main className="page-content">
        <p>Danh sách sản phẩm điện tử</p>
        <ul>
          <li>Laptop</li>
          <li>Điện thoại</li>
          <li>Tai nghe</li>
        </ul>
      </main>
    </div>
  )
}
