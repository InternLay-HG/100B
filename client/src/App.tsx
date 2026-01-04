import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './Pages/Home/Home';
import NotFoundPage from './Pages/Error/Error';
import Signup from "./Pages/Auth/Signup";
import Login from './Pages/Auth/Login';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import EmailVerificationPage from './Pages/Auth/EmailVerify';
import Layout from './Layout/Layout';
import AuthLayout from './Layout/AuthLayout';
import Notes from './Pages/Note/Notes';
import Chats from './Pages/Chat/Chats';
import Polls from './Pages/Poll/Polls';
import Confession from './Pages/Confession/Confession';
import Settings from './Pages/Settings/Settings';

function App() {
  const user = useSelector((state: any) => state.auth.userData);

  return (
    <BrowserRouter >
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route element={user ? <Layout /> : <Navigate to={'/login'} />}>
          <Route path='/' element={<Home />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/chats' element={<Chats />} />
          <Route path='/polls' element={<Polls />} />
          <Route path='/confession' element={<Confession />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={user ? <Navigate to={'/'} /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to={'/'} /> : <Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;