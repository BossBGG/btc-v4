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
  ActivityListItem
} from '../components/DashboardSummaryCards';

// ข้อมูลสำหรับแสดงกิจกรรมและการขออนุมัติ
interface EventData {
  id: string;
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  approvalStatus: 'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ';
  participants: number;
  maxParticipants: number;
  createdBy: string;
}

interface ApprovalRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  eventId: string;
  eventTitle: string;
  requestDate: string;
  status: 'รออนุมัติ' | 'อนุมัติ' | 'ปฏิเสธ';
}

// สร้างข้อมูลตัวอย่างสำหรับกิจกรรมทั้งหมด
const mockAllEvents: EventData[] = [
  {
    id: '1',
    title: 'BootCampCPE',
    eventType: 'อบรม',
    startDate: '17/05/2568',
    endDate: '18/05/2568',
    approvalStatus: 'อนุมัติ',
    participants: 25,
    maxParticipants: 30,
    createdBy: 'staff-1'
  },
  {
    id: '2',
    title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
    eventType: 'อาสา',
    startDate: '22/05/2568',
    endDate: '22/05/2568',
    approvalStatus: 'อนุมัติ',
    participants: 45,
    maxParticipants: 50,
    createdBy: 'staff-2'
  },
  {
    id: '3',
    title: 'งานวิ่งการกุศล Run for Wildlife',
    eventType: 'ช่วยงาน',
    startDate: '30/05/2568',
    endDate: '30/05/2568',
    approvalStatus: 'อนุมัติ',
    participants: 18,
    maxParticipants: 20,
    createdBy: 'staff-3'
  },
  {
    id: '4',
    title: 'อบรมปฐมพยาบาลเบื้องต้น',
    eventType: 'อบรม',
    startDate: '10/04/2568',
    endDate: '10/04/2568',
    approvalStatus: 'รออนุมัติ',
    participants: 0,
    maxParticipants: 40,
    createdBy: 'staff-4'
  },
  {
    id: '5',
    title: 'ค่ายอาสาพัฒนาโรงเรียน',
    eventType: 'อาสา',
    startDate: '01/03/2568',
    endDate: '03/03/2568',
    approvalStatus: 'ไม่อนุมัติ',
    participants: 0,
    maxParticipants: 25,
    createdBy: 'staff-5'
  },
  {
    id: '6',
    title: 'อบรมทักษะการนำเสนอและการพูดในที่สาธารณะ',
    eventType: 'อบรม',
    startDate: '18/06/2568',
    endDate: '19/06/2568',
    approvalStatus: 'อนุมัติ',
    participants: 35,
    maxParticipants: 35,
    createdBy: 'staff-1'
  },
  {
    id: '7',
    title: 'งานบริจาคโลหิตเพื่อช่วยเหลือผู้ป่วย',
    eventType: 'ช่วยงาน',
    startDate: '25/06/2568',
    endDate: '25/06/2568',
    approvalStatus: 'รออนุมัติ',
    participants: 0,
    maxParticipants: 15,
    createdBy: 'staff-2'
  },
  {
    id: '8',
    title: 'โครงการสอนน้อง ปันความรู้สู่ชุมชน',
    eventType: 'อาสา',
    startDate: '01/07/2568',
    endDate: '31/07/2568',
    approvalStatus: 'อนุมัติ',
    participants: 19,
    maxParticipants: 20,
    createdBy: 'staff-3'
  },
  {
    id: '9',
    title: 'โครงการวิ่งการกุศลมหาวิทยาลัย',
    eventType: 'ช่วยงาน',
    startDate: '15/07/2568',
    endDate: '15/07/2568',
    approvalStatus: 'ไม่อนุมัติ',
    participants: 0,
    maxParticipants: 50,
    createdBy: 'staff-4'
  },
  {
    id: '10',
    title: 'อบรมเทคนิคการสร้างแอพพลิเคชั่นมือถือ',
    eventType: 'อบรม',
    startDate: '01/08/2568',
    endDate: '02/08/2568',
    approvalStatus: 'รออนุมัติ',
    participants: 0,
    maxParticipants: 40,
    createdBy: 'staff-5'
  }
];

// ข้อมูลคำขออนุมัติ
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    requesterName: 'นายสมชาย ใจดี (เจ้าหน้าที่)',
    requesterId: 'staff-1',
    eventId: '4',
    eventTitle: 'อบรมปฐมพยาบาลเบื้องต้น',
    requestDate: '05/05/2568',
    status: 'รออนุมัติ'
  },
  {
    id: '2',
    requesterName: 'นางสาวสมหญิง รักเรียน (เจ้าหน้าที่)',
    requesterId: 'staff-2',
    eventId: '7',
    eventTitle: 'งานบริจาคโลหิตเพื่อช่วยเหลือผู้ป่วย',
    requestDate: '15/05/2568',
    status: 'รออนุมัติ'
  },
  {
    id: '3',
    requesterName: 'นายวิชัย เก่งกาจ (เจ้าหน้าที่)',
    requesterId: 'staff-3',
    eventId: '10',
    eventTitle: 'อบรมเทคนิคการสร้างแอพพลิเคชั่นมือถือ',
    requestDate: '20/05/2568',
    status: 'รออนุมัติ'
  },
  {
    id: '4',
    requesterName: 'นางสาวแก้วตา สว่างศรี (เจ้าหน้าที่)',
    requesterId: 'staff-4',
    eventId: '11',
    eventTitle: 'โครงการปลูกป่าชายเลนเฉลิมพระเกียรติ',
    requestDate: '25/05/2568',
    status: 'รออนุมัติ'
  },
  {
    id: '5',
    requesterName: 'นายเอกชัย สุดยอด (เจ้าหน้าที่)',
    requesterId: 'staff-5',
    eventId: '12',
    eventTitle: 'แข่งขันโปรแกรมมิ่งระดับมหาวิทยาลัย',
    requestDate: '30/05/2568',
    status: 'รออนุมัติ'
  }
];

// ข้อมูลผู้เข้าร่วมกิจกรรมมากที่สุด
const mockTopParticipants = [
  { id: '1', name: 'นายสมชาย ใจดี', count: 15 },
  { id: '2', name: 'นางสาวสมหญิง รักเรียน', count: 12 },
  { id: '3', name: 'นายวิชัย เก่งกาจ', count: 10 },
  { id: '4', name: 'นางสาวแก้วตา สว่างศรี', count: 8 },
  { id: '5', name: 'นายเอกชัย สุดยอด', count: 7 }
];

function AdminDashboardPage() {
  const { theme } = useTheme();
  const [events, setEvents] = useState<EventData[]>(mockAllEvents);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);

  // นับจำนวนกิจกรรมตามประเภท
  const countEventsByType = () => {
    return {
      'อบรม': events.filter(event => event.eventType === 'อบรม').length,
      'อาสา': events.filter(event => event.eventType === 'อาสา').length,
      'ช่วยงาน': events.filter(event => event.eventType === 'ช่วยงาน').length
    };
  };

  // นับจำนวนผู้เข้าร่วมตามประเภทกิจกรรม
  const countParticipantsByEventType = () => {
    return {
      'อบรม': events.filter(event => event.eventType === 'อบรม').reduce((sum, event) => sum + event.participants, 0),
      'อาสา': events.filter(event => event.eventType === 'อาสา').reduce((sum, event) => sum + event.participants, 0),
      'ช่วยงาน': events.filter(event => event.eventType === 'ช่วยงาน').reduce((sum, event) => sum + event.participants, 0)
    };
  };

  // นับจำนวนกิจกรรมตามสถานะการอนุมัติ
  const countEventsByApprovalStatus = () => {
    return {
      'อนุมัติ': events.filter(event => event.approvalStatus === 'อนุมัติ').length,
      'รออนุมัติ': events.filter(event => event.approvalStatus === 'รออนุมัติ').length,
      'ไม่อนุมัติ': events.filter(event => event.approvalStatus === 'ไม่อนุมัติ').length
    };
  };

  // หากิจกรรมที่มีผู้เข้าร่วมมากที่สุด 5 อันดับ
  const getTopEvents = () => {
    return [...events]
      .filter(event => event.participants > 0)
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 5)
      .map(event => ({
        id: event.id,
        title: event.title,
        count: event.participants
      }));
  };

  // จัดการการอนุมัติหรือปฏิเสธกิจกรรม
  const handleApproval = (requestId: string, isApproved: boolean) => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: isApproved ? 'อนุมัติ' : 'ปฏิเสธ' } 
          : req
      )
    );
  };

  // ข้อมูลที่นับได้
  const eventTypeCount = countEventsByType();
  const participantsByType = countParticipantsByEventType();
  const approvalStatusCount = countEventsByApprovalStatus();
  const topEvents = getTopEvents();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          แดชบอร์ดผู้ดูแลระบบ
        </h1>

        {/* แถวสำหรับกราฟ Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* แผนภูมิวงกลมแสดงจำนวนประเภทกิจกรรมที่เคยจัด */}
          <DashboardCard title="จำนวนประเภทกิจกรรมที่เคยจัด">
            <div className="flex flex-col md:flex-row items-center justify-center h-64">
              {/* Pie Chart */}
              <PieChart data={[
                { label: 'อบรม', value: eventTypeCount['อบรม'], color: '#3B82F6' },
                { label: 'อาสา', value: eventTypeCount['อาสา'], color: '#10B981' },
                { label: 'ช่วยงาน', value: eventTypeCount['ช่วยงาน'], color: '#8B5CF6' }
              ]} />
              
              {/* Legend */}
              <div className="ml-0 md:ml-8 mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>อบรม: {eventTypeCount['อบรม']}</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>อาสา: {eventTypeCount['อาสา']}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span>ช่วยงาน: {eventTypeCount['ช่วยงาน']}</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* แผนภูมิแท่งแสดงจำนวนผู้เข้าร่วมกิจกรรมแต่ละประเภท */}
          <DashboardCard title="จำนวนผู้เข้าร่วมกิจกรรมแต่ละประเภท">
            <div className="h-64">
              <BarChart 
                data={[
                  { label: 'อบรม', value: participantsByType['อบรม'], color: '#3B82F6' },
                  { label: 'อาสา', value: participantsByType['อาสา'], color: '#10B981' },
                  { label: 'ช่วยงาน', value: participantsByType['ช่วยงาน'], color: '#8B5CF6' }
                ]}
                maxValue={Math.max(...Object.values(participantsByType))}
                barWidth={40}
                height={180}
                barGap={20}
              />
            </div>
          </DashboardCard>
        </div>

        {/* แถวสำหรับบัตรสรุปจำนวนกิจกรรมตามสถานะการอนุมัติ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* จำนวนกิจกรรมที่อนุมัติแล้ว */}
          <DashboardCard title="กิจกรรมที่อนุมัติแล้ว">
            <div className="flex flex-col items-center p-4">
              <div className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {approvalStatusCount['อนุมัติ']}
              </div>
              <p className="text-center mb-4">จำนวนกิจกรรมที่ได้รับการอนุมัติ</p>
              <Link 
                to="/admin/event-approval?status=approved" 
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                ดูทั้งหมด
              </Link>
            </div>
          </DashboardCard>

          {/* จำนวนกิจกรรมที่รออนุมัติ */}
          <DashboardCard title="กิจกรรมที่รออนุมัติ">
            <div className="flex flex-col items-center p-4">
              <div className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {approvalStatusCount['รออนุมัติ']}
              </div>
              <p className="text-center mb-4">จำนวนกิจกรรมที่รอการอนุมัติ</p>
              <Link 
                to="/admin/event-approval?status=pending" 
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-600 hover:bg-yellow-700'
                } text-white`}
              >
                ดูทั้งหมด
              </Link>
            </div>
          </DashboardCard>

          {/* จำนวนกิจกรรมที่ถูกปฏิเสธ */}
          <DashboardCard title="กิจกรรมที่ถูกปฏิเสธ">
            <div className="flex flex-col items-center p-4">
              <div className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                {approvalStatusCount['ไม่อนุมัติ']}
              </div>
              <p className="text-center mb-4">จำนวนกิจกรรมที่ถูกปฏิเสธ</p>
              <Link 
                to="/admin/event-approval?status=rejected" 
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                ดูทั้งหมด
              </Link>
            </div>
          </DashboardCard>
        </div>

        {/* แถวสำหรับ Popular Activities และ Top Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* กิจกรรมที่มีความเข้าร่วมมากที่สุด */}
          <DashboardSummaryCard 
            title="กิจกรรมที่มีคนเข้าร่วมมากที่สุด" 
           
          >
            <div className="space-y-1">
              {topEvents.map((activity, index) => (
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

          {/* ผู้เข้าร่วมกิจกรรมมากที่สุด */}
          <DashboardSummaryCard 
            title="ผู้เข้าร่วมกิจกรรมมากที่สุด" 
           
          >
            <div className="space-y-1">
              {mockTopParticipants.map((participant, index) => (
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

        {/* แถวสำหรับผู้ขออนุมัติกิจกรรม */}
        <div className="mb-8">
          <DashboardCard 
            title="ผู้ขออนุมัติกิจกรรม" 
            action={{ label: "ดูทั้งหมด", to: "/admin/event-approval?status=pending" }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ชื่อผู้ขออนุมัติ
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      ชื่อกิจกรรม
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}>
                      วันขออนุมัติ
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
                  {approvalRequests.filter(req => req.status === 'รออนุมัติ').map((request) => (
                    <tr key={request.id} className={`${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {request.requesterName}
                        <div className="text-xs font-normal text-gray-500">
                          {request.requesterId}
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

export default AdminDashboardPage;