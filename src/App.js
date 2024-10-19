import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes instead of Switch
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Transaction Dashboard</h1>
                <Routes>
                    <Route path="/" element={<Dashboard />} /> 
                   
                </Routes>
            </div>
        </Router>
    );
};

export default App;
