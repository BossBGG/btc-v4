import { useTheme } from '../stores/theme.store';

interface LoadingPageProps {
  type?: 'events' | 'detail' | 'admin';
}

function LoadingPage({ type = 'events' }: LoadingPageProps) {
  const { theme } = useTheme();
  
  // คลาสสำหรับ skeleton pulse animation
  const skeletonClass = `animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`;

  // หากเป็นหน้ารายละเอียดกิจกรรม
  if (type === 'detail') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container mx-auto py-8 px-4">
          {/* Skeleton สำหรับชื่อกิจกรรม */}
          <div className={`${skeletonClass} h-10 w-3/4 mb-6 rounded`}></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skeleton สำหรับรูปภาพกิจกรรม */}
            <div className={`${skeletonClass} h-96 rounded-xl`}></div>

            {/* Skeleton สำหรับรายละเอียดกิจกรรม */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
              <div className={`${skeletonClass} h-6 w-1/3 mb-4 rounded`}></div>
              
              <div className={`${skeletonClass} h-4 w-full mb-2 rounded`}></div>
              <div className={`${skeletonClass} h-4 w-full mb-2 rounded`}></div>
              <div className={`${skeletonClass} h-4 w-2/3 mb-4 rounded`}></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index}>
                    <div className={`${skeletonClass} h-3 w-1/3 mb-1 rounded`}></div>
                    <div className={`${skeletonClass} h-5 w-2/3 rounded`}></div>
                  </div>
                ))}
              </div>

              <div className={`${skeletonClass} h-10 w-full mt-4 rounded-md`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // หากเป็นหน้า admin dashboard
  if (type === 'admin') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container mx-auto py-8 px-4">
          {/* Skeleton สำหรับหัวข้อ */}
          <div className={`${skeletonClass} h-8 w-1/3 mb-8 rounded`}></div>

          {/* Skeleton สำหรับกราฟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
              <div className={`${skeletonClass} h-6 w-1/2 mb-4 rounded`}></div>
              <div className={`${skeletonClass} h-64 w-full rounded-md`}></div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
              <div className={`${skeletonClass} h-6 w-1/2 mb-4 rounded`}></div>
              <div className={`${skeletonClass} h-64 w-full rounded-md`}></div>
            </div>
          </div>

          {/* Skeleton สำหรับการ์ดสรุป */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
                <div className={`${skeletonClass} h-5 w-1/2 mb-4 rounded`}></div>
                <div className="flex flex-col items-center">
                  <div className={`${skeletonClass} h-16 w-16 rounded-full mb-4`}></div>
                  <div className={`${skeletonClass} h-4 w-1/2 mb-2 rounded`}></div>
                  <div className={`${skeletonClass} h-8 w-1/3 mt-2 rounded-lg`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton สำหรับตาราง */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-md mb-8`}>
            <div className={`${skeletonClass} h-6 w-1/3 mb-4 rounded`}></div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {[...Array(5)].map((_, index) => (
                      <th key={index} className="py-3">
                        <div className={`${skeletonClass} h-4 w-full rounded`}></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...Array(5)].map((_, colIndex) => (
                        <td key={colIndex} className="py-3">
                          <div className={`${skeletonClass} h-4 w-full rounded`}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // หน้ารายการกิจกรรม (ค่าเริ่มต้น)
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Skeleton สำหรับ Search Bar */}
      <div className="px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className={`${skeletonClass} h-11 w-full rounded-md mb-4`}></div>
        </div>
      </div>
      
      <div className="p-6 pb-12">
        {/* Skeleton สำหรับหัวข้อ */}
        <div className={`${skeletonClass} h-8 w-1/3 mb-6 rounded`}></div>
        
        {/* Skeleton สำหรับ Carousel */}
        <div className={`${skeletonClass} h-64 w-full rounded-lg mb-8`}></div>
        
        {/* Skeleton สำหรับแท็บ */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`${skeletonClass} h-8 w-20 rounded-full`}></div>
          ))}
        </div>
        
        {/* Skeleton สำหรับกิจกรรมที่แสดง */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
              <div className={`${skeletonClass} h-48 w-full`}></div>
              <div className="p-4">
                <div className={`${skeletonClass} h-5 w-3/4 mb-2 rounded`}></div>
                <div className={`${skeletonClass} h-4 w-1/2 mb-2 rounded`}></div>
                <div className={`${skeletonClass} h-4 w-full mb-2 rounded`}></div>
                <div className={`${skeletonClass} h-4 w-5/6 mb-3 rounded`}></div>
                <div className="flex justify-between">
                  <div className={`${skeletonClass} h-8 w-20 rounded-md`}></div>
                  <div className={`${skeletonClass} h-8 w-20 rounded-md`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;