import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import routes from './routes';
import { AuthStoreProvider } from './stores/auth.store';
import { Suspense, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { ThemeProvider, useTheme } from './stores/theme.store';
import { useAuth } from './hooks/UseAuth.hook';


function AppRoutes() {
  const element = useRoutes(routes);
  const location = useLocation();
  const { theme } = useTheme();
  const { isAuthenticated, userRole, checkAuth } = useAuth();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(true);

  // ตรวจสอบสถานะการล็อกอินเมื่อแอปเริ่มทำงาน
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // กำหนดเส้นทางที่ต้องการซ่อน Sidebar 
    const noLayoutPaths = ['/login', '/register', '/error-500', '/error-404'];
    
    // เส้นทางที่ต้องการแสดง SearchBar
    const searchBarPaths = ['/'];
    
    // ตรวจสอบว่าเส้นทางปัจจุบันอยู่ในรายการที่ต้องซ่อน Sidebar หรือไม่
    const shouldHideLayout = noLayoutPaths.some(path => 
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
    
    // ตรวจสอบว่าเส้นทางปัจจุบันอยู่ในรายการที่ต้องแสดง SearchBar หรือไม่
    const shouldShowSearchBar = searchBarPaths.includes(location.pathname);
    
    // ตรวจสอบว่าเป็นหน้า 404 หรือไม่
    const is404Page = location.pathname.includes('/error') || 
                      !routes.some(route => 
                        route.path === location.pathname || 
                        (route.path?.includes(':') && location.pathname.match(route.path.replace(/:\w+/g, '[^/]+')))
                      );
    
    // ซ่อน Sidebar ในหน้า login, register, error หรือหน้า 404
    // แสดง Sidebar เมื่อล็อกอินแล้วเท่านั้น
    setShowSidebar(!shouldHideLayout && !is404Page && isAuthenticated);
    
    // แสดง SearchBar เฉพาะในหน้าที่กำหนด
    setShowSearchBar(shouldShowSearchBar);
    
    // เพิ่ม class พิเศษสำหรับหน้า login และ register
    if (noLayoutPaths.some(path => location.pathname.startsWith(path))) {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }
    
    // เลื่อนหน้าเว็บไปที่ด้านบนเมื่อเปลี่ยนหน้า
    window.scrollTo(0, 0);
  }, [location.pathname, isAuthenticated]);

  // ปรับแต่ง class หลักขึ้นอยู่กับธีมที่เลือก
  const baseClasses = `min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`;
  
  // คอมโพเนนต์แสดงขณะโหลด
  const LoadingComponent = () => (
    <div className={`flex items-center justify-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div 
        className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`} 
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          กำลังโหลด...
        </span>
      </div>
    </div>
  );

  return (
    <div className={baseClasses} data-theme={theme}>
      {isAuthenticated && !location.pathname.includes('/login') && !location.pathname.includes('/register') && <Sidebar />}
      
      <div className="flex h-screen">
        {showSidebar && <Sidebar />}
        
        <div className={`flex-1 overflow-y-auto ${showSidebar ? 'pl-64' : ''} ${isAuthenticated && !location.pathname.includes('/login') ? 'pt-16' : ''}`}>
          <Suspense fallback={<LoadingComponent />}>
            {element}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthStoreProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthStoreProvider>
    </BrowserRouter>
  );
}

export default App;