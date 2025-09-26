import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import WorkloadForm from './pages/WorkloadForm';
import SimpleWorkloadForm from './pages/SimpleWorkloadForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard title="Clouditect Dashboard" />} />
        <Route path="workload">
          <Route path="simple" element={<SimpleWorkloadForm title="Business Cloud Strategy" />} />
          <Route path="detailed" element={<WorkloadForm title="Technical Cloud Architecture" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;