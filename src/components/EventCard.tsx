import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';

// กำหนดประเภทสำหรับกิจกรรมตามโครงสร้าง API
export interface EventCardProps {
  id: number;
  title: string;
  description: string;
  type: {
    id: number;
    name: string;
  };
  status: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  imageUrl: string;
  location?: string; // อาจจะมีหรือไม่มีก็ได้
  compact?: boolean; // สำหรับโหมดแสดงแบบย่อในหน้า Homepage
}

function EventCard({
  id,
  title,
  description,
  type,
  status,
  startTime,
  endTime,
  maxParticipants,
  currentParticipants,
  createdBy,
  imageUrl,
  location = "มหาวิทยาลัย", // ค่าเริ่มต้นกรณีไม่มีข้อมูลจาก API
  compact = true, // ค่าเริ่มต้นคือแบบย่อ (ใช้ในหน้า Homepage)
}: EventCardProps) {
  const { theme } = useTheme();
  
  // กำหนดสีตามประเภทกิจกรรม
  const typeColorMap: Record<string, string> = {
    'อบรม': 'bg-blue-600 text-white',
    'อาสา': 'bg-green-600 text-white',
    'ช่วยงาน': 'bg-purple-600 text-white',
  };

  const typeColor = typeColorMap[type.name] || 'bg-gray-600 text-white';
  
  // ฟังก์ชันตัดข้อความให้สั้นลงถ้าเกินความยาวที่กำหนด
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // ฟังก์ชันแปลงรูปแบบวันที่เวลาให้เป็นรูปแบบไทย
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    // แปลงเป็นรูปแบบวันที่ไทย (วัน/เดือน/ปี)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    
    return `${day}/${month}/${year}`;
  };

  // สร้าง URL สำหรับรูปภาพ
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://bootcampp.karinwdev.site${imageUrl}`;

  return (
    <div 
      className={`rounded-lg overflow-hidden h-full flex flex-col transition-all ${
        theme === 'dark' 
          ? 'bg-gray-800 shadow-gray-900 hover:shadow-gray-700' 
          : 'bg-white shadow-md hover:shadow-lg'
      }`}
    >
      {/* ส่วนรูปภาพและแท็กประเภทกิจกรรม */}
      <div className="relative h-44">
        <img 
          src={fullImageUrl || '/api/placeholder/400/320'} 
          alt={title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // กรณีโหลดรูปไม่สำเร็จ ให้แสดงรูป placeholder แทน
            (e.target as HTMLImageElement).src = '/api/placeholder/400/320';
          }}
        />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${typeColor}`}>
          {type.name}
        </span>
      </div>
      
      {/* ส่วนข้อมูลกิจกรรม */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm mb-3 line-clamp-2 min-h-[40px] ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {truncateText(description || "ไม่มีคำอธิบาย", 100)}
        </p>
        
        <div className="mt-auto">
          {/* ชื่อผู้จัด */}
          <div className={`flex items-center text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="truncate">{createdBy.name}</span>
          </div>
          
          {/* วันที่จัดกิจกรรม */}
          <div className={`flex items-center text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{formatDate(startTime)} - {formatDate(endTime)}</span>
          </div>
          
          {/* สถานที่จัดกิจกรรม */}
          <div className={`flex items-center text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
          
          {/* จำนวนผู้เข้าร่วม */}
          <div className={`flex items-center text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="truncate">{currentParticipants} / {maxParticipants} คน</span>
          </div>
          
          {/* ปุ่มดูรายละเอียด */}
          <Link
            to={`/events/detail/${id}`}
            className={`block w-full py-2 text-center rounded-md transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;