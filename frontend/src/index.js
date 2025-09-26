import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { WorkloadProvider } from './context/WorkloadContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WorkloadProvider>
        <App />
      </WorkloadProvider>
    </BrowserRouter>
  </React.StrictMode>
);