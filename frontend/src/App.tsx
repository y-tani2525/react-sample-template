import { useCounterStore } from './store/counterStore'
import './App.css'

// .env から環境変数を読み込む（VITE_ プレフィックスのみクライアントに露出）
const appTitle = import.meta.env.VITE_APP_TITLE
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="container">
      <h1>{appTitle}</h1>
      <p className="hint">Zustand で状態管理されたカウンター</p>
      <div className="card">
        <p className="count">{count}</p>
        <div className="buttons">
          <button onClick={decrement}>-1</button>
          <button onClick={reset}>reset</button>
          <button onClick={increment}>+1</button>
        </div>
      </div>
      <p className="env">API Base URL: <code>{apiBaseUrl}</code></p>
    </div>
  )
}

export default App
