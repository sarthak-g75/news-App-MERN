import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
ReactDOM.createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <BrowserRouter>
      {/* <React.StrictMode> */}
      <div className='h-screen '>
        <App />
      </div>
      {/* </React.StrictMode> */}
    </BrowserRouter>
  </RecoilRoot>
)
