import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';
import { PieChart, BarChart } from '../components/charts/Charts';
import { 
  DashboardCard, 
  StatusBadge, 
  TypeBadge, 
  ApprovalActions 
} from '../components/dashboard/DashboardComponents';
import { 
  DashboardSummaryCard,
  ActivityListItem, 
  PopularActivitiesCard, 
  TopParticipantsCard 
} from '../components/DashboardSummaryCards';

// Mock data for dashboard
interface ActivityData {
  id: string;
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  status: 'รับสมัคร' | 'กำลังดำเนินการ' | 'เสร็จสิ้น';
  participants: number;
  maxParticipants: number;
}

interface ApprovalRequest {
  id: string;
  studentName: string;
  studentId: string;
  eventId: string;
  eventTitle: string;
  requestDate: string;
  status: 'รอการอนุมัติ' | 'อนุมัติ' | 'ปฏิเสธ';
}

// Mock data for activities created by staff
const mockActivities: ActivityData[] = [
  {
    id: '1',
    title: 'BootCampCPE',
    eventType: 'อบรม',
    startDate: '17/05/2568',
    endDate: '18/05/2568',
    status: 'รับสมัคร',
    participants: 15,
    maxParticipants: 30
  },
  {
    id: '2',
    title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
    eventType: 'อาสา',
    startDate: '22/05/2568',
    endDate: '22/05/2568',
    status: 'รับสมัคร',
    participants: 25,
    maxParticipants: 50
  },
  {
    id: '3',
    title: 'งานวิ่งการกุศล Run for Wildlife',
    eventType: 'ช่วยงาน',
    startDate: '30/05/2568',
    endDate: '30/05/2568',
    status: 'รับสมัคร',
    participants: 10,
    maxParticipants: 20
  },
  {
    id: '4',
    title: 'อบรมปฐมพยาบาลเบื้องต้น',
    eventType: 'อบรม',
    startDate: '10/04/2568',
    endDate: '10/04/2568',
    status: 'กำลังดำเนินการ',
    participants: 28,
    maxParticipants: 40
  },
  {
    id: '5',
    title: 'ค่ายอาสาพัฒนาโรงเรียน',
    eventType: 'อาสา',
    startDate: '01/03/2568',
    endDate: '03/03/2568',
    status: 'เสร็จสิ้น',
    participants: 23,
    maxParticipants: 25
  }
];

// Mock data for approval requests
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    studentName: 'นายสมชาย ใจดี',
    studentId: '65015001',
    eventId: '1',
    eventTitle: 'BootCampCPE',
    requestDate: '12/05/2568',
    status: 'รอการอนุมัติ'
  },
  {
    id: '2',
    studentName: 'นางสาวสมหญิง รักเรียน',
    studentId: '65015002',
    eventId: '1',
    eventTitle: 'BootCampCPE',
    requestDate: '12/05/2568',
    status: 'รอการอนุมัติ'
  },
  {
    id: '3',
    studentName: 'นายวิชัย เก่งกาจ',
    studentId: '65015003',
    eventId: '2',
    eventTitle: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
    requestDate: '13/05/2568',
    status: 'รอการอนุมัติ'
  },
  {
    id: '4',
    studentName: 'นางสาวแก้วตา สว่างศรี',
    studentId: '65015004',
    eventId: '3',
    eventTitle: 'งานวิ่งการกุศล Run for Wildlife',
    requestDate: '14/05/2568',
    status: 'รอการอนุมัติ'
  },
  {
    id: '5',
    studentName: 'นายภูมิ ปัญญาดี',
    studentId: '65015005',
    eventId: '2',
    eventTitle: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
    requestDate: '13/05/2568',
    status: 'รอการอนุมัติ'
  }
];

// Mock data for popular activities
const mockPopularActivities = [
  { id: '1', title: 'BootCampCPE', count: 25 },
  { id: '2', title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว', count: 22 },
  { id: '3', title: 'งานวิ่งการกุศล Run for Wildlife', count: 18 }
];

// Mock data for top participants
const mockTopParticipants = [
  { id: '1', name: 'นายสมชาย ใจดี', count: 15, activityId: '1' },
  { id: '2', name: 'นางสาวสมหญิง รักเรียน', count: 12, activityId: '2' },
  { id: '3', name: 'นายวิชัย เก่งกาจ', count: 8, activityId: '3' }
];

function StaffDashboardPage() {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityData[]>(mockActivities);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [popularActivities, setPopularActivities] = useState(mockPopularActivities);
  const [topParticipants, setTopParticipants] = useState(mockTopParticipants);

  // Count activity types for pie chart
  const activityTypeCount = {
    'อบรม': activities.filter(a => a.eventType === 'อบรม').length,
    'อาสา': activities.filter(a => a.eventType === 'อาสา').length,
    'ช่วยงาน': activities.filter(a => a.eventType === 'ช่วยงาน').length
  };

  // Handle approval
  const handleApproval = (requestId: string, isApproved: boolean) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: isApproved ? 'อนุมัติ' : 'ปฏิเสธ' } 
          : req
      )
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            แดชบอร์ดเจ้าหน้าที่
          </h1>
          <div className="flex space-x-4">
            <Link
              to="/create-event"
              className={`px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium transition-colors flex items-center`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              สร้างกิจกรรมใหม่
            </Link>
          </div>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Types Pie Chart Card */}
          <DashboardCard title="จำนวนประเภทกิจกรรมที่เคยจัด">
            <div className="flex flex-col md:flex-row items-center justify-center h-64">
              {/* Pie Chart Visualization */}
              <PieChart data={[
                { label: 'อบรม', value: activityTypeCount['อบรม'], color: '#3B82F6' },
                { label: 'อาสา', value: activityTypeCount['อาสา'], color: '#10B981' },
                { label: 'ช่วยงาน', value: activityTypeCount['ช่วยงาน'], color: '#8B5CF6' }
              ]} />
              
              {/* Legend */}
              <div className="ml-0 md:ml-8 mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>อบรม: {activityTypeCount['อบรม']}</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>อาสา: {activityTypeCount['อาสา']}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span>ช่วยงาน: {activityTypeCount['ช่วยงาน']}</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Participants Bar Chart Card */}
          <DashboardCard title="จำนวนผู้เข้าร่วมกิจกรรมของฉัน">
            <div className="h-64">
              <BarChart 
                data={activities.slice(0, 5).map(activity => ({
                  label: activity.title,
                  value: activity.participants,
                  color: activity.eventType === 'อบรม' 
                    ? '#3B82F6' 
                    : activity.eventType === 'อาสา' 
                      ? '#10B981' 
                      : '#8B5CF6'
                }))}
                maxValue={Math.max(...activities.map(a => a.participants))}
                barWidth={40}
                height={180}
                barGap={20}
              />
            </div>
          </DashboardCard>
        </div>

        {/* Second Row - Popular Activities and Top Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Activities Card */}
          <DashboardSummaryCard 
            title="กิจกรรมของฉันที่มีคนข้าร่วมมากที่สุด" 
            
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

          {/* Top Participants Card */}
          <DashboardSummaryCard 
            title="ผู้เข้าร่วมกิจกรรมของฉันมากที่สุด" 
            
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
        </div>

        {/* Activities & Approval Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activities Table Card */}
          <DashboardCard 
            title="รายละเอียดกิจกรรมที่เคยสร้าง" 
            action={{ label: "ดูทั้งหมด", to: "/staff/activities" }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ชื่อกิจกรรม
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ประเภท
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      สถานะ
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ผู้เข้าร่วม
                    </th>
                    <th scope="col" className={`px-6 py-3 text-center text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ดูรายละเอียด
                    </th>
                  </tr>
                </thead>
                <tbody className={`${
                  theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {activities.slice(0, 5).map((activity) => (
                    <tr key={activity.id} className={`${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {activity.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <TypeBadge type={activity.eventType} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={activity.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {activity.participants}/{activity.maxParticipants}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <Link to={`/events/detail/${activity.id}`} className={`inline-flex ${
                          theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>

          {/* Approval Requests Card */}
          <DashboardCard 
            title="ผู้ขออนุมัติเข้าร่วมกิจกรรม" 
            action={{ label: "ดูทั้งหมด", to: "/staff/approval-requests" }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ชื่อผู้สมัคร
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ชื่อกิจกรรม
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      เวลาที่สมัคร
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      สถานะ
                    </th>
                    <th scope="col" className={`px-6 py-3 text-center text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className={`${
                  theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {approvalRequests.filter(req => req.status === 'รอการอนุมัติ').map((request) => (
                    <tr key={request.id} className={`${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.studentName}
                        <div className="text-xs font-normal text-gray-500">
                          {request.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.eventTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {request.requestDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <ApprovalActions
                          onApprove={() => handleApproval(request.id, true)}
                          onReject={() => handleApproval(request.id, false)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboardPage;