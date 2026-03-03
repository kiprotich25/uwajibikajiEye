import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import CandidatesPage from './pages/CandidatesPage';
import CandidatePage from './pages/CandidatePage';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-dark-950 text-slate-200">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/report" element={<ReportForm />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/map" element={<MapView />} />
                        <Route path="/candidates" element={<CandidatesPage />} />
                        <Route path="/candidates/:name" element={<CandidatePage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
