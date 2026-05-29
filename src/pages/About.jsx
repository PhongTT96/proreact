export function About({ onBack }) {
  return (
    <div className="App">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1>Giới thiệu</h1>
      </header>
      <main className="page-content">
        <p>Đây là trang giới thiệu công ty.</p>
        <p>Chúng tôi là một công ty bán hàng trực tuyến hàng đầu.</p>
      </main>
    </div>
  )
}
