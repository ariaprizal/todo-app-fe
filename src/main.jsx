import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ToastContainer
            className="toast-container"
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            icon={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
)
