// src/App.tsx
import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateFormPage from './Pages/CreateFormPage';
import PreviewPage from './Pages/PreviewPage';
import MyFormsPage from './Pages/MyFormsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/create" />} />
        <Route path="/create" element={<CreateFormPage />} /> 
        <Route path="/preview/:formId" element={<PreviewPage />} /> 
        <Route path="/myforms" element={<MyFormsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;