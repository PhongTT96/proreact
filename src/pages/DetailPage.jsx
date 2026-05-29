export function DetailPage({ onBack }) {
  return (
    <div className="App">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1>Chi tiết trang</h1>
      </header>
      <main className="page-content">
        <p>Đây là trang chi tiết. Nội dung trang được hiển thị ở đây.</p>
      </main>
    </div>
  )
}
