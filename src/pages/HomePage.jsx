import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export function HomePage() {
  const [status, setStatus] = useState(null)
  const [tableName, setTableName] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [tableData, setTableData] = useState(null)
  const [tableData2, setTableData2] = useState(null)

  const checkSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('Chưa cấu hình Supabase. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env.')
      return
    }

    const { data, error } = await supabase.auth.getSession()
    if (error) {
      setStatus(`Lỗi Supabase: ${error.message}`)
    } else {
      setStatus(data?.session ? 'Supabase đã kết nối, phiên đăng nhập tồn tại.' : 'Supabase đã kết nối, chưa có phiên đăng nhập.')
    }
  }

  const uploadRecord = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('Chưa cấu hình Supabase. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env.')
      return
    }

    if (!tableName.trim()) {
      setStatus('Vui lòng nhập tên bảng Supabase.')
      return
    }

    let record
    try {
      record = JSON.parse(jsonData)
    } catch (error) {
      setStatus('Dữ liệu JSON không hợp lệ. Vui lòng kiểm tra lại.')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.from(tableName.trim()).insert([record])
    setLoading(false)

    if (error) {
      setStatus(`Upload lỗi: ${error.message}`)
    } else {
      setStatus(`Upload thành công: ${JSON.stringify(data)}`)
      setJsonData('')
    }
  }

  const loadTestTable = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('Chưa cấu hình Supabase. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env.')
      return
    }

    setFetchLoading(true)
    const { data, error } = await supabase.from('test').select('*')
    setFetchLoading(false)

    if (error) {
      setStatus(`Lấy dữ liệu lỗi: ${error.message}`)
      setTableData(null)
    } else {
      setStatus(data.length ? `Đã tải ${data.length} dòng từ bảng 'test'.` : "Bảng 'test' rỗng.")
      setTableData(data)
    }
  }

  const loadTest2Table = async () => {
    if (!isSupabaseConfigured()) {
      setStatus('Chưa cấu hình Supabase. Vui lòng thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env.')
      return
    }

    setFetchLoading(true)
    const { data, error } = await supabase.from('test2').select('*')
    setFetchLoading(false)

    if (error) {
      setStatus(`Lấy dữ liệu lỗi: ${error.message}`)
      setTableData2(null)
    } else {
      setStatus(data.length ? `Đã tải ${data.length} dòng từ bảng 'test2'.` : "Bảng 'test2' rỗng.")
      setTableData2(data)
    }
  }

  return (
    <div className="App">
      <h1>Hello World! 1</h1>
      <p>Chào mừng bạn đến với trang chủ</p>

      <section style={{ marginTop: 24 }}>
        <button type="button" onClick={checkSupabase}>
          Kiểm tra Supabase
        </button>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Tải dữ liệu từ bảng 'test'</h2>
        <button
          type="button"
          onClick={loadTestTable}
          disabled={fetchLoading}
          style={{ marginTop: 8, marginRight: 12 }}
        >
          {fetchLoading ? 'Đang tải...' : "Tải dữ liệu từ 'test'"}
        </button>
        <button
          type="button"
          onClick={loadTest2Table}
          disabled={fetchLoading}
          style={{ marginTop: 8 }}
        >
          {fetchLoading ? 'Đang tải...' : "Tải dữ liệu từ 'test2'"}
        </button>
      </section>

      {tableData && (
        <section style={{ marginTop: 24 }}>
          <h3>Kết quả test</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f7f7f7', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            {JSON.stringify(tableData, null, 2)}
          </pre>
        </section>
      )}

      {tableData2 && (
        <section style={{ marginTop: 24 }}>
          <h3>Kết quả test2</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f7f7f7', padding: '16px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
            {JSON.stringify(tableData2, null, 2)}
          </pre>
        </section>
      )}

      <section style={{ marginTop: 32 }}>
        <h2>Upload dữ liệu vào bảng Supabase</h2>
        <label>
          Tên bảng:
          <input
            type="text"
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            placeholder="Nhập tên bảng"
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>
        <label style={{ display: 'block', marginTop: 16 }}>
          Dữ liệu JSON:
          <textarea
            value={jsonData}
            onChange={(event) => setJsonData(event.target.value)}
            placeholder='Ví dụ: {"name":"Test", "price":100}'
            rows={8}
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </label>
        <button
          type="button"
          onClick={uploadRecord}
          disabled={loading}
          style={{ marginTop: 16 }}
        >
          {loading ? 'Đang tải...' : 'Upload bản ghi'}
        </button>
      </section>

      {status && (
        <section style={{ marginTop: 24 }}>
          <p>{status}</p>
        </section>
      )}
    </div>
  )
}
