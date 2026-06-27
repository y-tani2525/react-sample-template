import { useCounterStore } from './store/counterStore'
import './App.css'

// .env から環境変数を読み込む（VITE_ プレフィックスのみクライアントに露出）
const appTitle = import.meta.env.VITE_APP_TITLE
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

function App() {
  const { count, increment, decrement, reset } = useCounterStore()
  const title = "Zustand で状態管理されたカウンター";
  const fruits = ["apple", "banana", "grape"];

  return (
    <div className="container">
      <h1>{appTitle}</h1>
      <p className="hint">{title}</p>
      <div className="card">
        <p className="count">{count}</p>
        <div className="buttons">
          <button onClick={decrement}>-1</button>
          <button onClick={reset}>reset</button>
          <button onClick={increment}>+1</button>
        </div>
      </div>
      <ul>
          {fruits.map((fruit, index) => (
              <li key={index}>{fruit}</li>
          ))}
      </ul>
      <p className="env">API Base URL: <code>{apiBaseUrl}</code></p>
    </div>
  )
}

export default App
