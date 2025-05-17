import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../stores/theme.store';

interface EventsSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showMoreLink?: string;
  onShowMore?: () => void;
  eventType?: 'อบรม' | 'อาสา' | 'ช่วยงาน' | string;
}

function EventsSection({ 
  title, 
  subtitle, 
  children, 
  showMoreLink, 
  onShowMore,
  eventType 
}: EventsSectionProps) {
  const { theme } = useTheme();

  // กำหนดสีตามประเภทกิจกรรม (สำหรับแสดงในหัวข้อ section)
  const typeColorMap: Record<string, string> = {
    'อบรม': 'text-blue-600',
    'อาสา': 'text-green-600',
    'ช่วยงาน': 'text-purple-600',
  };

  const typeColor = eventType ? typeColorMap[eventType] || '' : '';

  return (
    <div className="mb-10">
      {/* ส่วนหัวของเซคชัน */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold mb-2 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {title}
            {eventType && typeColorMap[eventType] && (
              <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${
                eventType === 'อบรม' 
                  ? 'bg-blue-100 text-blue-600' 
                  : eventType === 'อาสา' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {eventType}
              </span>
            )}
          </h2>
          {subtitle && (
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } text-sm`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ส่วนแสดง Card กิจกรรม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {children}
      </div>

      {/* ปุ่มดูเพิ่มเติม */}
      {(showMoreLink || onShowMore) && (
        <div className="mt-6 text-center">
          {showMoreLink ? (
            <Link
              to={showMoreLink}
              className={`px-6 py-2 inline-block border rounded-md transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              ดูเพิ่มเติม
            </Link>
          ) : (
            <button
              onClick={onShowMore}
              className={`px-6 py-2 border rounded-md transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              ดูเพิ่มเติม
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EventsSection;