import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { Link } from 'react-router-dom';
import { mockEventsWithApproval } from '../data/mockEventsWithApproval';
import { useAuth } from '../hooks/UseAuth.hook';

// ประเภทข้อมูลสำหรับกิจกรรม
interface ActivityItem {
  id: string;
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  approvalStatus: 'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ';
  status: 'รับสมัคร' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก';
  hours: number;
  participants: number;
  maxParticipants: number;
  createdBy: string;
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'title' | 'eventType' | 'startDate' | 'endDate' | 'approvalStatus' | 'status' | 'hours' | 'participants';
type SortOrder = 'asc' | 'desc';

function StaffActivitiesPage() {
  const { theme } = useTheme();
  const { userId } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    // ข้อมูลตัวอย่าง (ในโปรเจคจริง ควรใช้ API เพื่อดึงข้อมูล)
    // แปลงข้อมูลจาก mockEventsWithApproval เป็นรูปแบบที่ต้องการ
    const staffActivities: ActivityItem[] = mockEventsWithApproval
      .filter(event => event.createdBy === userId) // กรองเฉพาะกิจกรรมที่สร้างโดย staff ที่กำลังใช้งาน
      .map(event => ({
        id: String(event.id), // แปลง id เป็น string เสมอ
        title: event.title,
        eventType: event.eventType,
        startDate: event.startDate,
        endDate: event.endDate,
        approvalStatus: event.approvalStatus,
        status: Math.random() > 0.7 ? 'เสร็จสิ้น' : Math.random() > 0.4 ? 'กำลังดำเนินการ' : 'รับสมัคร', // สุ่มสถานะสำหรับข้อมูลตัวอย่าง
        hours: event.hours,
        participants: Math.floor(Math.random() * event.maxParticipants), // สุ่มจำนวนผู้เข้าร่วมสำหรับข้อมูลตัวอย่าง
        maxParticipants: event.maxParticipants,
        createdBy: event.createdBy
      }));

    // เพิ่มข้อมูลเพิ่มเติมสำหรับตัวอย่าง
    const additionalActivities: ActivityItem[] = [
      {
        id: '101',
        title: 'อบรมเทคนิคการสร้างแอพพลิเคชั่นมือถือ',
        eventType: 'อบรม',
        startDate: '01/06/2568',
        endDate: '02/06/2568',
        approvalStatus: 'อนุมัติ',
        status: 'รับสมัคร',
        hours: 8,
        participants: 12,
        maxParticipants: 40,
        createdBy: userId || ''
      },
      {
        id: '102',
        title: 'โครงการปลูกป่าชายเลนเฉลิมพระเกียรติ',
        eventType: 'อาสา',
        startDate: '10/06/2568',
        endDate: '10/06/2568',
        approvalStatus: 'รออนุมัติ',
        status: 'รับสมัคร',
        hours: 6,
        participants: 15,
        maxParticipants: 60,
        createdBy: userId || ''
      },
      {
        id: '103',
        title: 'ช่วยงานแนะแนวการศึกษา',
        eventType: 'ช่วยงาน',
        startDate: '15/06/2568',
        endDate: '16/06/2568',
        approvalStatus: 'อนุมัติ',
        status: 'รับสมัคร',
        hours: 10,
        participants: 8,
        maxParticipants: 20,
        createdBy: userId || ''
      },
      {
        id: '104',
        title: 'อบรมการเขียนโปรแกรมด้วย Python',
        eventType: 'อบรม',
        startDate: '05/05/2568',
        endDate: '06/05/2568',
        approvalStatus: 'อนุมัติ',
        status: 'กำลังดำเนินการ',
        hours: 12,
        participants: 38,
        maxParticipants: 45,
        createdBy: userId || ''
      },
      {
        id: '105',
        title: 'โครงการทาสีโรงเรียนเพื่อน้อง',
        eventType: 'อาสา',
        startDate: '01/04/2568',
        endDate: '02/04/2568',
        approvalStatus: 'อนุมัติ',
        status: 'เสร็จสิ้น',
        hours: 16,
        participants: 35,
        maxParticipants: 35,
        createdBy: userId || ''
      },
      {
        id: '106',
        title: 'ช่วยงานสัปดาห์วิทยาศาสตร์',
        eventType: 'ช่วยงาน',
        startDate: '15/03/2568',
        endDate: '20/03/2568',
        approvalStatus: 'อนุมัติ',
        status: 'เสร็จสิ้น',
        hours: 30,
        participants: 20,
        maxParticipants: 25,
        createdBy: userId || ''
      },
      {
        id: '107',
        title: 'อบรมภาษาอังกฤษเพื่อการสื่อสาร',
        eventType: 'อบรม',
        startDate: '10/02/2568',
        endDate: '11/02/2568',
        approvalStatus: 'ไม่อนุมัติ',
        status: 'ยกเลิก',
        hours: 8,
        participants: 0,
        maxParticipants: 40,
        createdBy: userId || ''
      }
    ];

    setActivities([...staffActivities, ...additionalActivities]);
  }, [userId]);

  // ฟังก์ชันเรียงข้อมูล
  const sortActivities = (field: SortField) => {
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ฟังก์ชันจัดการการปิดกิจกรรม
  const handleCloseActivity = (id: string) => {
    const confirmed = window.confirm('คุณต้องการปิดกิจกรรมนี้ใช่หรือไม่? นิสิตที่เข้าร่วมจะได้รับคะแนนและชั่วโมงกิจกรรม');
    if (confirmed) {
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, status: 'เสร็จสิ้น' } : activity
      ));
    }
  };

  // ฟังก์ชันจัดการการยกเลิกกิจกรรม
  const handleCancelActivity = (id: string) => {
    const confirmed = window.confirm('คุณต้องการยกเลิกกิจกรรมนี้ใช่หรือไม่? นิสิตที่เข้าร่วมจะไม่ได้รับคะแนนและชั่วโมงกิจกรรม');
    if (confirmed) {
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, status: 'ยกเลิก' } : activity
      ));
    }
  };

  // กรองและเรียงข้อมูล
  const filteredAndSortedActivities = activities
    .filter(activity => 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || activity.eventType === filterType) &&
      (filterStatus === '' || activity.status === filterStatus)
    )
    .sort((a, b) => {
      // เรียงตามฟิลด์ที่เลือก
      if (sortField === 'participants') {
        // สำหรับการเรียงจำนวนผู้เข้าร่วม
        return sortOrder === 'asc' 
          ? a.participants - b.participants 
          : b.participants - a.participants;
      } else if (sortField === 'hours') {
        // สำหรับการเรียงจำนวนชั่วโมง
        return sortOrder === 'asc' 
          ? a.hours - b.hours 
          : b.hours - a.hours;
      } else {
        // สำหรับฟิลด์ที่เป็นข้อความ
        const compareA = String(a[sortField]).toLowerCase();
        const compareB = String(b[sortField]).toLowerCase();
        
        if (compareA < compareB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });

  // คำนวณหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedActivities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedActivities.length / itemsPerPage);

  // สีประเภทกิจกรรม
  const eventTypeColor = (type: string) => {
    switch (type) {
      case 'อบรม':
        return theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white';
      case 'อาสา':
        return theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-600 text-white';
      case 'ช่วยงาน':
        return theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white';
      default:
        return '';
    }
  };

  // สีสถานะการอนุมัติ
  const approvalStatusColor = (status: string) => {
    switch (status) {
      case 'อนุมัติ':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'รออนุมัติ':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'ไม่อนุมัติ':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };

  // สีสถานะกิจกรรม
  const activityStatusColor = (status: string) => {
    switch (status) {
      case 'รับสมัคร':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'กำลังดำเนินการ':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'เสร็จสิ้น':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'ยกเลิก':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default:
        return '';
    }
  };

  // กำหนดสี header bar ตามธีม
  const getHeaderBarColor = () => {
    return theme === 'dark' 
      ? 'bg-blue-800' // โทนสีน้ำเงินเข้มสำหรับ Dark Mode
      : 'bg-blue-600'; // โทนสีน้ำเงินสำหรับ Light Mode
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">รายละเอียดกิจกรรมทั้งหมด</h1>
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
        
        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหากิจกรรม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } border`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกประเภทกิจกรรม</option>
              <option value="อบรม">อบรม</option>
              <option value="อาสา">อาสา</option>
              <option value="ช่วยงาน">ช่วยงาน</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            >
              <option value="">ทุกสถานะกิจกรรม</option>
              <option value="รับสมัคร">รับสมัคร</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              <option value="ยกเลิก">ยกเลิก</option>
            </select>
          </div>
        </div>
        
        {/* ตารางกิจกรรม */}
        <div className={`overflow-x-auto rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${getHeaderBarColor()} text-white`}>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('title')}
                >
                  <div className="flex items-center">
                    ชื่อกิจกรรม
                    {sortField === 'title' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('eventType')}
                >
                  <div className="flex items-center">
                    ประเภทกิจกรรม
                    {sortField === 'eventType' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('startDate')}
                >
                  <div className="flex items-center">
                    วันที่เริ่มต้น
                    {sortField === 'startDate' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('endDate')}
                >
                  <div className="flex items-center">
                    วันที่สิ้นสุด
                    {sortField === 'endDate' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('approvalStatus')}
                >
                  <div className="flex items-center">
                    สถานะอนุมัติ
                    {sortField === 'approvalStatus' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('status')}
                >
                  <div className="flex items-center">
                    สถานะกิจกรรม
                    {sortField === 'status' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('hours')}
                >
                  <div className="flex items-center">
                    ชั่วโมง
                    {sortField === 'hours' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortActivities('participants')}
                >
                  <div className="flex items-center">
                    ผู้เข้าร่วม
                    {sortField === 'participants' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 py-3 text-center text-sm font-medium whitespace-nowrap"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
            }`}>
              {currentItems.length > 0 ? (
                currentItems.map((activity) => (
                  <tr key={activity.id} className={`hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="font-medium truncate max-w-[150px]" title={activity.title}>
                        {activity.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColor(activity.eventType)}`}>
                        {activity.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {activity.startDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {activity.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${approvalStatusColor(activity.approvalStatus)}`}>
                        {activity.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${activityStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {activity.hours}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Link 
                        to={`/staff/activity-participants/${activity.id}`}
                        className={`${
                          theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                        }`}
                      >
                        {activity.participants}/{activity.maxParticipants}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ปุ่มดูรายละเอียด */}
                        <Link 
                          to={`/events/detail/${activity.id}`} 
                          className={`p-1 rounded-full ${
                            theme === 'dark' ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-200'
                          }`}
                          title="ดูรายละเอียด"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        {/* ปุ่มแก้ไข */}
                        <Link 
                          to={`/edit-event/${activity.id}`} 
                          className={`p-1 rounded-full ${
                            theme === 'dark' ? 'text-yellow-400 hover:bg-gray-700' : 'text-yellow-600 hover:bg-gray-200'
                          }`}
                          title="แก้ไข"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        {/* ปุ่มปิดกิจกรรม - แสดงเฉพาะเมื่อกิจกรรมยังไม่เสร็จสิ้นหรือยกเลิก */}
                        {(activity.status !== 'เสร็จสิ้น' && activity.status !== 'ยกเลิก') && (
                          <button
                            onClick={() => handleCloseActivity(activity.id)}
                            className={`p-1 rounded-full ${
                              theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-gray-200'
                            }`}
                            title="ปิดกิจกรรม"
                          >
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </button>
                       )}
                       
                       {/* ปุ่มยกเลิกกิจกรรม - แสดงเฉพาะเมื่อกิจกรรมยังไม่เสร็จสิ้นหรือยกเลิก */}
                       {(activity.status !== 'เสร็จสิ้น' && activity.status !== 'ยกเลิก') && (
                         <button
                           onClick={() => handleCancelActivity(activity.id)}
                           className={`p-1 rounded-full ${
                             theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-200'
                           }`}
                           title="ยกเลิกกิจกรรม"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </button>
                       )}
                     </div>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td
                   colSpan={9}
                   className="px-6 py-4 text-center text-sm font-medium"
                 >
                   ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>
       
       {/* Pagination */}
       {filteredAndSortedActivities.length > 0 && (
         <div className="flex justify-center mt-6">
           <nav className="flex items-center space-x-2">
             <button
               onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
               disabled={currentPage === 1}
               className={`px-3 py-1 rounded-md ${
                 currentPage === 1
                   ? 'opacity-50 cursor-not-allowed'
                   : 'hover:bg-gray-200'
               } ${
                 theme === 'dark'
                   ? 'bg-gray-700 text-white hover:bg-gray-600'
                   : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
               }`}
               aria-label="Previous page"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
               </svg>
             </button>
             
             {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
               let pageNumber;
               if (totalPages <= 5) {
                 pageNumber = i + 1;
               } else if (currentPage <= 3) {
                 pageNumber = i + 1;
               } else if (currentPage >= totalPages - 2) {
                 pageNumber = totalPages - 4 + i;
               } else {
                 pageNumber = currentPage - 2 + i;
               }
               
               return (
                 <button
                   key={i}
                   onClick={() => setCurrentPage(pageNumber)}
                   className={`w-8 h-8 flex items-center justify-center rounded-md ${
                     currentPage === pageNumber
                       ? theme === 'dark'
                         ? 'bg-blue-600 text-white'
                         : 'bg-blue-600 text-white'
                       : theme === 'dark'
                         ? 'bg-gray-700 text-white hover:bg-gray-600'
                         : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                   }`}
                   aria-label={`Page ${pageNumber}`}
                   aria-current={currentPage === pageNumber ? "page" : undefined}
                 >
                   {pageNumber}
                 </button>
               );
             })}
             
             <button
               onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
               disabled={currentPage === totalPages}
               className={`px-3 py-1 rounded-md ${
                 currentPage === totalPages
                   ? 'opacity-50 cursor-not-allowed'
                   : 'hover:bg-gray-200'
               } ${
                 theme === 'dark'
                   ? 'bg-gray-700 text-white hover:bg-gray-600'
                   : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
               }`}
               aria-label="Next page"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
               </svg>
             </button>
           </nav>
         </div>
       )}
     </div>
   </div>
 );
}

export default StaffActivitiesPage;