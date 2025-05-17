import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.hook';

function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginRole, setLoginRole] = useState<string | null>(null); // เพิ่ม state เก็บ role
  const { handleLogin, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  // Hide Navbar on Login page
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectBasedOnRole(userRole);
    }
  }, [isAuthenticated, userRole, navigate]);

  // ฟังก์ชันนำทางตาม role
  const redirectBasedOnRole = (role: string | null) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'staff') {
      navigate('/staff-dashboard');
    } else {
      navigate('/');
    }
  };

  // No longer needed to detect role from student ID as the API will handle this

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate input
    if (!/^\d{8}$/.test(studentId)) {
      setErrorMessage('รหัสนิสิตต้องเป็นตัวเลข 8 หลัก');
      return;
    }
    
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    try {
      // Call login function from auth hook
      const result = await handleLogin({ studentId, password });
      
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }
      
      // Set login role from API response for display
      if (result.user && result.user.role) {
        setLoginRole(result.user.role);
      }

      // Save rememberMe preference if needed
      if (rememberMe) {
        localStorage.setItem('rememberStudentId', studentId);
      } else {
        localStorage.removeItem('rememberStudentId');
      }

      // แสดง Role ที่เข้าสู่ระบบในคอนโซล
      console.log(`User logged in as: ${result.user.role}`);
      
      // Navigation will happen automatically due to the isAuthenticated useEffect
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Load remembered studentId if available
  useEffect(() => {
    const rememberedId = localStorage.getItem('rememberStudentId');
    if (rememberedId) {
      setStudentId(rememberedId);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 lg:w-1/3 bg-white flex flex-col items-center justify-start pt-4">
        {/* Header - Logo and system name */}
        <div className="flex items-center mb-8">
          <img 
            src="/logo.png" 
            alt="ระบบจัดการงานอาสา" 
            className="h-12 w-12"
          />
          <h1 className="text-lg font-bold text-gray-800 ml-2">ระบบจัดการงานอาสาและกิจกรรมมหาวิทยาลัย</h1>
        </div>
        
        {/* Login form */}
        <div className="w-full max-w-md p-8 border-2 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-2">เข้าสู่ระบบ</h2>
          <p className="text-center text-gray-600 mb-8">ยินดีต้อนรับกลับมาสู่บัญชีของคุณ</p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {loginRole && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              กำลังเข้าสู่ระบบในฐานะ: {loginRole === 'admin' ? 'ผู้ดูแลระบบ' : loginRole === 'staff' ? 'เจ้าหน้าที่' : 'นิสิต'}
            </div>
          )}

          <form onSubmit={onLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="studentId" className="flex items-center mb-1 text-gray-700">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-sm font-medium">รหัสนิสิต</span>
              </label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="กรุณากรอกรหัสนิสิต 8 ตัว"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                maxLength={8}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="flex items-center mb-1 text-gray-700">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span className="text-sm font-medium">รหัสผ่าน</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณากรอกรหัสผ่าน"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? (
                    // Eye icon when password is visible
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    // Closed eye icon when password is hidden
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  จดจำบัญชีของฉัน
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              เข้าสู่ระบบ
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                ยังไม่มีบัญชี? <Link to="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Testing information */}
        <div className="mt-4 p-4 bg-blue-50 rounded-md max-w-md">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">เกี่ยวกับการเข้าสู่ระบบ:</h3>
          <ul className="text-sm text-blue-700 list-disc list-inside">
            <li>กรุณาใช้รหัสนิสิตและรหัสผ่านที่ได้รับจากระบบ</li>
            <li>หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อผู้ดูแลระบบ</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">*หมายเหตุ: ระบบจะกำหนดสิทธิ์การใช้งานตามข้อมูลที่ลงทะเบียนไว้</p>
        </div>
      </div>

      {/* Right side - Blue background */}
      <div className="hidden md:block md:w-1/2 lg:w-2/3 bg-blue-500"></div>
    </div>
  );
}

export default LoginPage;