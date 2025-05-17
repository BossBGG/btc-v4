import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../stores/theme.store';
import EventCard, { EventCardProps } from '../EventCard';

interface EventSectionCardProps {
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  events: EventCardProps[];
  showMoreLink?: string;
  maxDisplay?: number;
}

function EventSectionCard({
  title,
  eventType,
  events,
  showMoreLink,
  maxDisplay = 3,
}: EventSectionCardProps) {
  const { theme } = useTheme();
  
  // กำหนดสีตามประเภทกิจกรรม
  const typeColorMap = {
    'อบรม': 'text-blue-600',
    'อาสา': 'text-green-600',
    'ช่วยงาน': 'text-purple-600',
  };
  
  const typeColor = typeColorMap[eventType];
  
  // แปลงประเภทกิจกรรมเป็นพารามิเตอร์สำหรับ URL (ถ้าต้องใช้ภาษาอังกฤษ)
  const typeParam = {
    'อบรม': 'training',
    'อาสา': 'volunteer',
    'ช่วยงาน': 'helper',
  }[eventType];
  
  // URL สำหรับการดูเพิ่มเติม หากไม่มีการระบุ
  const defaultShowMoreLink = `/events/${typeParam}`;
  
  return (
    <div className={`mb-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow`}>
      {/* ส่วนหัวของเซคชัน */}
      <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
        <h2 className={`text-xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          กิจกรรม
        </h2>
        <div className={`text-xl font-bold ${typeColor} ml-2`}>
          {eventType}
        </div>
      </div>
      
      {/* ส่วนแสดง Card กิจกรรม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.length > 0 ? (
          events.slice(0, maxDisplay).map((event) => (
            <EventCard
              key={event.id}
              {...event}
            />
          ))
        ) : (
          <div className={`col-span-3 text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            ไม่พบกิจกรรมในหมวดหมู่นี้
          </div>
        )}
      </div>
      
      {/* ปุ่มดูเพิ่มเติม */}
      {events.length > 0 && (
        <div className={`px-6 py-3 text-center border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Link
            to={showMoreLink || defaultShowMoreLink}
            className={`inline-block px-6 py-2 border rounded-md transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            ดูเพิ่มเติม
          </Link>
        </div>
      )}
    </div>
  );
}

export default EventSectionCard;