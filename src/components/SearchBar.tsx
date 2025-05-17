import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../pages/LoadingPage';

// ประเภทที่ใช้ในการค้นหา
interface SearchFilterType {
  id: string;
  label: string;
  checked: boolean;
}

interface SearchBarProps {
  className?: string; // สำหรับกำหนด class เพิ่มเติม
  onSearch?: (query: string, filters: SearchFilterType[]) => void; // callback เมื่อมีการค้นหา
}

function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // ตัวเลือกประเภทสำหรับการค้นหา
  const [searchFilters, setSearchFilters] = useState<SearchFilterType[]>([
    { id: 'training', label: 'อบรม', checked: true },
    { id: 'volunteer', label: 'อาสา', checked: false },
    { id: 'helper', label: 'ช่วยงาน', checked: false },
  ]);

  // เพิ่ม useEffect สำหรับจัดการการแสดง error (จำลอง)
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        navigate('/error-500');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showError, navigate]);

  // ฟังก์ชันสำหรับการสลับเลือก/ยกเลิกการเลือกฟิลเตอร์
  const toggleFilter = (id: string) => {
    const updatedFilters = searchFilters.map((filter) =>
      filter.id === id ? { ...filter, checked: !filter.checked } : filter
    );
    
    setSearchFilters(updatedFilters);
  };

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = () => {
    setIsLoading(true);
    
    // จำลองการค้นหาและโหลดข้อมูล
    setTimeout(() => {
      setIsLoading(false);
      
      // โอกาส 10% ที่จะแสดงหน้า Error
      const shouldShowError = Math.random() < 0.1;
      
      if (shouldShowError) {
        setShowError(true);
      } else if (onSearch) {
        onSearch(searchTerm, searchFilters);
      } else {
        // สร้าง URL พารามิเตอร์
        const searchParams = new URLSearchParams();
        if (searchTerm) searchParams.set('q', searchTerm);
        
        // ตรวจสอบฟิลเตอร์ที่เลือก
        searchFilters.forEach(filter => {
          if (filter.checked) {
            searchParams.set(filter.id, 'true');
          }
        });
        
        navigate(`/search?${searchParams.toString()}`);
      }
    }, 1500); // จำลองการโหลด 1.5 วินาที
  };

  // ฟังก์ชันสำหรับการกด Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ถ้ากำลังโหลดข้อมูล ให้แสดง LoadingPage
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className={`${className} sticky top-4 z-10 `}>
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          <div className="flex rounded-md shadow-sm">
            {/* ช่องค้นหา */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ค้นหากิจกรรม"
                className={`w-full px-4 py-2.5 pl-10 pr-4 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            
            {/* ปุ่มค้นหา */}
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
            >
              ค้นหา
            </button>
            
            {/* ปุ่มเลือกประเภท */}
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className={`px-3 py-2 border rounded-r-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              <span className="sr-only">เลือกประเภท</span>
              <svg
                className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                ></path>
              </svg>
            </button>
          </div>

          {/* Dropdown สำหรับเลือกประเภท */}
          {showTypeDropdown && (
            <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-3 border rounded-md ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <h4 className={`mb-2 text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>ประเภท</h4>
                {searchFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center mb-2">
                    <input
                      id={`filter-${filter.id}`}
                      type="checkbox"
                      checked={filter.checked}
                      onChange={() => toggleFilter(filter.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`filter-${filter.id}`}
                      className={`ml-2 text-sm cursor-pointer ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      {filter.label}
                    </label>
                  </div>
                ))}
                
                {/* ปุ่มยืนยันการเลือกฟิลเตอร์ */}
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => setShowTypeDropdown(false)}
                    className={`px-3 py-1 text-sm rounded ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-colors`}
                  >
                    ตกลง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;