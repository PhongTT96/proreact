export function Clothing({ onBack }) {
  return (
    <div className="App">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1>Quần áo</h1>
      </header>
      <main className="page-content">
        <p>Danh sách sản phẩm quần áo</p>
        <ul>
          <li>Áo sơ mi</li>
          <li>Quần jeans</li>
          <li>Váy đầm</li>
        </ul>
      </main>
    </div>
  )
}
