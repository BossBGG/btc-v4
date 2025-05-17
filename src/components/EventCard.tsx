import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';

// กำหนดประเภทสำหรับกิจกรรม
export interface EventCardProps {
  id: string | number;
  title: string;
  description: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  maxParticipants: number;
  score: number;
  hours: number;
  location: string;
  organizer: string;
  image: string;
  onClick?: () => void;
  compact?: boolean; // สำหรับโหมดแสดงแบบย่อในหน้า Homepage
}

function EventCard({
  id,
  title,
  description,
  eventType,
  startDate,
  endDate,
  maxParticipants,
  score,
  hours,
  location,
  organizer,
  image,
  onClick,
  compact = true, // ค่าเริ่มต้นคือแบบย่อ (ใช้ในหน้า Homepage)
}: EventCardProps) {
  const { theme } = useTheme();
  
  // กำหนดสีตามประเภทกิจกรรม
  const typeColorMap = {
    'อบรม': 'bg-blue-600 text-white',
    'อาสา': 'bg-green-600 text-white',
    'ช่วยงาน': 'bg-purple-600 text-white',
  };

  const typeColor = typeColorMap[eventType];
  
  // ฟังก์ชันตัดข้อความให้สั้นลงถ้าเกินความยาวที่กำหนด
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

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
          src={image || '/api/placeholder/400/320'} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${typeColor}`}>
          {eventType}
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
          {truncateText(description, 100)}
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
            <span className="truncate">{organizer}</span>
          </div>
          
          {/* วันที่จัดกิจกรรม */}
          <div className={`flex items-center text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{startDate} - {endDate}</span>
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
          
          {/* ปุ่มดูรายละเอียด */}
          <Link
            to={`/events/detail/${id}`}
            className={`block w-full py-2 text-center rounded-md transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={onClick}
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;