import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './assets/index.css'

// elements
import App from './App'
import Login from './Login'
import Register from './Register'
import Layout from './components/Layout'

// router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout protectedPage={true}><App /></Layout>
  },
  {
    path: '/login',
    element: <Layout><Login /></Layout>
  },
  {
    path: '/register',
    element: <Layout><Register /></Layout>
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
