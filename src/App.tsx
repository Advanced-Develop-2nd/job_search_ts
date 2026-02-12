import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AgreementPage from './pages/AgreementPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <ThemeProvider>
      {/* basename を追加して GitHub Pages のサブディレクトリに対応させる */}
      <Router basename="/job_search_ts/">
        <Routes>
          <Route path="/" element={<AgreementPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}