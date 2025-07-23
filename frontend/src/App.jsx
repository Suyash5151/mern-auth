import {Navigate, Route, Routes} from 'react-router-dom'
import FloatingComponents from './Components/FloatingComponents.jsx'
import './App.css'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import EmailVerification from './pages/EmailVerification.jsx'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import LoadingSpinner from './Components/LoadingSpinner.jsx'
import { formatDate } from '../utils/date.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  if (!user?.isVerified) return <Navigate to='/verify-email' replace />;

  return children;
};



  const RedirectAuthenticatedUser=({children})=>{
    const {isAuthenticated,user}=useAuthStore();
    if(isAuthenticated && user?.isVerified ){
      return<Navigate to="/" replace /> 
    }
    return children;

  };

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user}=useAuthStore();
 useEffect(() => {
  checkAuth();
}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
        <FloatingComponents color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0}/>
        <FloatingComponents color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5}/>
        <FloatingComponents color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2}/>
        
          <Routes>
            <Route
					path='/'
					element={
						isAuthenticated && user?.isVerified ? (
							<DashboardPage />
						) : (
							<Navigate to='/signup' replace />
						)
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<Signup/>
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerification />} />
				
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/signup' replace />} />

        </Routes>
        <Toaster/>

       
      </div>
        
    </>
  )
}

export default App
