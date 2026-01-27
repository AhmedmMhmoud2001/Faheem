import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import Subscriptions from './pages/Subscriptions';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import DifficultyLevel from './pages/DifficultyLevel';
import Exam from './pages/Exam';
import TrialTest from './pages/TrialTest';
import Profile from './pages/Profile';
import Explanation from './pages/Explanation';
import Practice from './pages/Practice';
import ExamResult from './pages/ExamResult';
import Feedback from './pages/Feedback';
import Checkout from './pages/Checkout';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth routes with Layout */}
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/forgot-password" element={
          <Layout>
            <ForgotPassword />
          </Layout>
        } />
        <Route path="/verify-code" element={
          <Layout>
            <VerifyCode />
          </Layout>
        } />

        {/* Main routes with Layout */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/subscriptions" element={
          <Layout>
            <Subscriptions />
          </Layout>
        } />
        <Route path="/checkout" element={
          <Layout>
            <Checkout />
          </Layout>
        } />
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        <Route path="/topics" element={
          <Layout>
            <Topics />
          </Layout>
        } />
        <Route path="/topics/:subject/difficulty" element={
          <Layout>
            <DifficultyLevel />
          </Layout>
        } />
        <Route path="/exam/:subject/:level" element={
          <Layout>
            <Exam />
          </Layout>
        } />
        <Route path="/trial-test" element={
          <Layout>
            <TrialTest />
          </Layout>
        } />
        <Route path="/practice/:subject/:level" element={
          <Layout>
            <Practice />
          </Layout>
        } />
        <Route path="/result" element={
          <Layout>
            <ExamResult />
          </Layout>
        } />
        <Route path="/feedback" element={
          <Layout>
            <Feedback />
          </Layout>
        } />
        <Route path="/explanation" element={ // In a real app this might be /explanation/:id
          <Layout>
            <Explanation />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
