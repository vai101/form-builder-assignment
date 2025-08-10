// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateFormPage from './Pages/CreateFormPage';
import PreviewPage from './Pages/PreviewPage';
import MyFormsPage from './Pages/MyFormsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreateFormPage />} /> {/* [cite: 21] */}
        <Route path="/preview/:formId" element={<PreviewPage />} /> {/* [cite: 22] */}
        <Route path="/myforms" element={<MyFormsPage />} /> {/* [cite: 23] */}
      </Routes>
    </Router>
  );
}

export default App;