import React from 'react';
import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';

// Props สำหรับคอมโพเนนต์การ์ดหลัก
interface DashboardSummaryCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showMore?: {
    label: string;
    to: string;
  };
}

// Props สำหรับแต่ละรายการกิจกรรม
interface ActivityListItemProps {
  number: number;
  title: string;
  count: number;
  unit?: string;
  id?: string | number;
}

/**
 * คอมโพเนนต์การ์ดที่ใช้ซ้ำได้สำหรับการแสดงข้อมูลสรุปบนแดชบอร์ด
 */
export const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({ 
  title, 
  children, 
  className = '',
  showMore
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } ${className}`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className={`font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h2>
        {showMore && (
          <Link 
            to={showMore.to} 
            className={`text-xs ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            {showMore.label}
          </Link>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

/**
 * คอมโพเนนต์สำหรับแสดงรายการกิจกรรมพร้อมลำดับ, ชื่อ และจำนวน
 */
export const ActivityListItem: React.FC<ActivityListItemProps> = ({ 
  number, 
  title, 
  count, 
  unit = 'คน',
  id 
}) => {
  const { theme } = useTheme();
  
  const content = (
    <div className="flex items-center py-2">
      <span className={`mr-2 font-medium ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {number}.
      </span>
      <span className={`flex-grow font-medium truncate ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        {title}
      </span>
      <span className={`ml-2 ${
        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
      }`}>
        {count} {unit}
      </span>
    </div>
  );
  
  // ถ้ามีการระบุ ID ให้ทำเป็นลิงก์
  if (id) {
    return (
      <Link 
        to={`/events/detail/${id}`} 
        className={`block ${
          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
        } rounded transition-colors`}
      >
        {content}
      </Link>
    );
  }
  
  return content;
};

/**
 * คอมโพเนนต์สำหรับแสดงกิจกรรมที่มีความนิยมสูงสุด
 */
export const PopularActivitiesCard: React.FC = () => {
  // ข้อมูลนี้ควรจะได้จาก API หรือ props
  const popularActivities = [
    { id: '1', title: 'BootCampCPE', count: 25 },
    { id: '2', title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว', count: 22 },
    { id: '3', title: 'งานวิ่งการกุศล Run for Wildlife', count: 18 }
  ];
  
  return (
    <DashboardSummaryCard 
      title="กิจกรรมที่มีความเข้าร่วมมากที่สุด" 
      showMore={{ label: "ดูทั้งหมด", to: "/staff/popular-activities" }}
    >
      <div className="space-y-1">
        {popularActivities.map((activity, index) => (
          <ActivityListItem 
            key={activity.id}
            id={activity.id}
            number={index + 1}
            title={activity.title}
            count={activity.count}
          />
        ))}
      </div>
    </DashboardSummaryCard>
  );
};

/**
 * คอมโพเนนต์สำหรับแสดงผู้เข้าร่วมกิจกรรมมากที่สุด
 */
export const TopParticipantsCard: React.FC = () => {
  // ข้อมูลนี้ควรจะได้จาก API หรือ props
  const topParticipants = [
    { id: '1', name: 'นายสมชาย ใจดี', count: 15, activityId: '1' },
    { id: '2', name: 'นางสาวสมหญิง รักเรียน', count: 12, activityId: '2' },
    { id: '3', name: 'นายวิชัย เก่งกาจ', count: 8, activityId: '3' }
  ];
  
  return (
    <DashboardSummaryCard 
      title="ผู้เข้าร่วมกิจกรรมของฉันมากที่สุด" 
      showMore={{ label: "ดูทั้งหมด", to: "/staff/top-participants" }}
    >
      <div className="space-y-1">
        {topParticipants.map((participant, index) => (
          <ActivityListItem 
            key={participant.id}
            number={index + 1}
            title={participant.name}
            count={participant.count}
            unit="กิจกรรม"
          />
        ))}
      </div>
    </DashboardSummaryCard>
  );
};