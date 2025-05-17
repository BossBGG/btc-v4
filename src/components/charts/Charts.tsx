import React from 'react';
import { useTheme } from '../../stores/theme.store';

// Create PieChart component
const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const { theme } = useTheme();
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate each segment's angle
  let currentAngle = 0;
  
  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {total === 0 ? (
          // Empty state if no data
          <circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} 
            strokeWidth="8"
          />
        ) : (
          // Render pie segments
          data.map((item, index) => {
            // Skip rendering if item has no value
            if (item.value === 0) return null;
            
            // Calculate this segment
            const angleSize = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angleSize;
            
            // Convert to radians
            const startRadians = (startAngle - 90) * Math.PI / 180;
            const endRadians = (endAngle - 90) * Math.PI / 180;
            
            // Calculate points
            const x1 = 50 + 40 * Math.cos(startRadians);
            const y1 = 50 + 40 * Math.sin(startRadians);
            const x2 = 50 + 40 * Math.cos(endRadians);
            const y2 = 50 + 40 * Math.sin(endRadians);
            
            // Path flag for large arc (> 180 degrees)
            const largeArcFlag = angleSize > 180 ? 1 : 0;
            
            // Create path
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            // Update current angle for next segment
            currentAngle = endAngle;
            
            return (
              <path 
                key={index} 
                d={path} 
                fill={item.color} 
                stroke={theme === 'dark' ? '#1F2937' : '#FFFFFF'} 
                strokeWidth="1"
              />
            );
          })
        )}
        {/* Center circle for donut effect */}
        <circle 
          cx="50" cy="50" r="25" 
          fill={theme === 'dark' ? '#1F2937' : '#FFFFFF'} 
        />
      </svg>
      
      {/* Center text for total */}
      {total > 0 && (
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {total}
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            กิจกรรม
          </span>
        </div>
      )}
    </div>
  );
};

// Create BarChart component
const BarChart = ({ 
  data, 
  maxValue,
  barWidth = 40, 
  height = 200,
  barGap = 10
}: { 
  data: { label: string; value: number; color: string }[]; 
  maxValue: number;
  barWidth?: number;
  height?: number;
  barGap?: number; 
}) => {
  const { theme } = useTheme();
  
  // Handle empty data case
  if (data.length === 0 || maxValue === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          ไม่มีข้อมูล
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart area */}
      <div className="flex-grow relative flex items-end justify-center">
        {/* Y-axis */}
        <div className={`absolute left-0 bottom-0 h-full w-0.5 ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
        }`}></div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 h-full w-8 flex flex-col justify-between items-end pr-2">
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {maxValue}
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {Math.round(maxValue / 2)}
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            0
          </span>
        </div>
        
        {/* Bars */}
        <div className="flex items-end justify-center space-x-6 ml-10">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Bar */}
              <div 
                className="rounded-t-md transition-all duration-500 ease-in-out"
                style={{ 
                  height: `${Math.max((item.value / maxValue) * height, 4)}px`, 
                  width: `${barWidth}px`,
                  backgroundColor: item.color,
                }}
              >
                {/* Bar value label */}
                <div className={`-mt-6 text-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <span className="text-xs font-medium">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* X-axis */}
      <div className={`h-0.5 ml-10 ${
        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
      }`}></div>
      
      {/* X-axis labels */}
      <div className="flex justify-center ml-10 mt-2">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="text-center"
            style={{ width: `${barWidth}px`, marginLeft: index > 0 ? `${barGap}px` : '0' }}
          >
            <span 
              className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate block`}
              title={item.label}
            >
              {item.label.length > 10 ? item.label.substring(0, 10) + '...' : item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PieChart, BarChart };