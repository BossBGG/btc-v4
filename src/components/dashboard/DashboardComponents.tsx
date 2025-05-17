import React from 'react';
import { useTheme } from '../../stores/theme.store';
import { PieChart, BarChart } from '../charts/Charts';
import { Link } from 'react-router-dom';

// Dashboard Card component for consistent styling
const DashboardCard = ({ 
  title, 
  children, 
  action 
}: { 
  title: string; 
  children: React.ReactNode;
  action?: { label: string; to: string } 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className={`text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h2>
        {action && (
          <Link 
            to={action.to} 
            className={`text-sm ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            {action.label}
          </Link>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const { theme } = useTheme();
  
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'รับสมัคร': theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      'กำลังดำเนินการ': theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800',
      'เสร็จสิ้น': theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
      'รอการอนุมัติ': theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800',
      'อนุมัติ': theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800',
      'ปฏิเสธ': theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
    };
    return colorMap[status] || '';
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Type badge component
const TypeBadge = ({ type }: { type: string }) => {
  const { theme } = useTheme();
  
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'อบรม': 'bg-blue-600 text-white',
      'อาสา': 'bg-green-600 text-white',
      'ช่วยงาน': 'bg-purple-600 text-white'
    };
    return colorMap[type] || '';
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(type)}`}>
      {type}
    </span>
  );
};

// Action button component
const ActionButton = ({ 
  icon, 
  label, 
  color, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  color: string;
  onClick: () => void 
}) => {
  const { theme } = useTheme();
  
  const getButtonColor = () => {
    if (color === 'green') {
      return theme === 'dark' 
        ? 'bg-green-800 text-green-400 hover:bg-green-700' 
        : 'bg-green-100 text-green-600 hover:bg-green-200';
    } else if (color === 'red') {
      return theme === 'dark' 
        ? 'bg-red-800 text-red-400 hover:bg-red-700' 
        : 'bg-red-100 text-red-600 hover:bg-red-200';
    }
    return '';
  };
  
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-full ${getButtonColor()}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

// Approval Actions component
const ApprovalActions = ({ 
  onApprove, 
  onReject 
}: { 
  onApprove: () => void; 
  onReject: () => void 
}) => {
  return (
    <div className="flex justify-center space-x-2">
      <ActionButton 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        } 
        label="อนุมัติ" 
        color="green" 
        onClick={onApprove} 
      />
      <ActionButton 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        } 
        label="ปฏิเสธ" 
        color="red" 
        onClick={onReject} 
      />
    </div>
  );
};

export { 
  DashboardCard, 
  StatusBadge, 
  TypeBadge, 
  ActionButton, 
  ApprovalActions 
};