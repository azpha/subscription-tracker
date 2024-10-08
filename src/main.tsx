import ReactDOM from 'react-dom/client'
import './assets/index.css'

// elements
import App from './App'
import Layout from './components/Layout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Layout>
    <App />
  </Layout>
)
