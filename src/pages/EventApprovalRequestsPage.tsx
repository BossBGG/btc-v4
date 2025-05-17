import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../stores/theme.store';

// ประเภทข้อมูลสำหรับคำขออนุมัติกิจกรรม
interface EventApprovalItem {
  id: string;
  title: string;
  eventType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  startDate: string;
  endDate: string;
  requesterName: string;
  requesterId: string; // รหัสเจ้าหน้าที่
  approvalStatus: 'อนุมัติ' | 'รออนุมัติ' | 'ไม่อนุมัติ';
  requestDate: string;
  description: string;
  maxParticipants: number;
}

// ประเภทสำหรับการเรียงข้อมูล
type SortField = 'title' | 'eventType' | 'startDate' | 'endDate' | 'requesterName' | 'approvalStatus' | 'requestDate';
type SortOrder = 'asc' | 'desc';

function EventApprovalRequestsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // ดึงค่า query parameters จาก URL
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status') || '';

  const [events, setEvents] = useState<EventApprovalItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('requestDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>(statusParam);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    // ข้อมูลตัวอย่าง (ในโปรเจคจริง ควรใช้ API เพื่อดึงข้อมูล)
    const mockEvents: EventApprovalItem[] = [
      {
        id: '1',
        title: 'อบรมการเขียนโปรแกรม Python สำหรับผู้เริ่มต้น',
        eventType: 'อบรม',
        startDate: '15/06/2568',
        endDate: '16/06/2568',
        requesterName: 'นายสมชาย ใจดี (เจ้าหน้าที่)',
        requesterId: 'staff-1',
        approvalStatus: 'อนุมัติ',
        requestDate: '01/05/2568',
        description: 'อบรมการเขียนโปรแกรมด้วยภาษา Python ตั้งแต่พื้นฐานจนถึงขั้นสูง เหมาะสำหรับผู้เริ่มต้นที่ไม่มีประสบการณ์',
        maxParticipants: 30
      },
      {
        id: '2',
        title: 'ปลูกป่าชายเลนเพื่อโลกสีเขียว',
        eventType: 'อาสา',
        startDate: '22/06/2568',
        endDate: '22/06/2568',
        requesterName: 'นางสาวสมหญิง รักเรียน (เจ้าหน้าที่)',
        requesterId: 'staff-2',
        approvalStatus: 'รออนุมัติ',
        requestDate: '05/05/2568',
        description: 'ร่วมกันปลูกป่าชายเลนเพื่อรักษาระบบนิเวศชายฝั่งและลดการกัดเซาะชายฝั่ง',
        maxParticipants: 50
      },
      {
        id: '3',
        title: 'งานวิ่งการกุศล Run for Wildlife',
        eventType: 'ช่วยงาน',
        startDate: '30/06/2568',
        endDate: '30/06/2568',
        requesterName: 'นายวิชัย เก่งกาจ (เจ้าหน้าที่)',
        requesterId: 'staff-3',
        approvalStatus: 'ไม่อนุมัติ',
        requestDate: '08/05/2568',
        description: 'ช่วยงานจัดการแข่งขันวิ่งการกุศลเพื่อระดมทุนช่วยเหลือสัตว์ป่าที่ใกล้สูญพันธุ์ในประเทศไทย',
        maxParticipants: 20
      },
      {
        id: '4',
        title: 'อบรมปฐมพยาบาลเบื้องต้นและการช่วยชีวิต',
        eventType: 'อบรม',
        startDate: '05/07/2568',
        endDate: '05/07/2568',
        requesterName: 'นางสาวแก้วตา สว่างศรี (เจ้าหน้าที่)',
        requesterId: 'staff-4',
        approvalStatus: 'รออนุมัติ',
        requestDate: '10/05/2568',
        description: 'เรียนรู้วิธีการปฐมพยาบาลเบื้องต้นในสถานการณ์ฉุกเฉิน การช่วยฟื้นคืนชีพ (CPR) และการใช้เครื่อง AED',
        maxParticipants: 40
      },
      {
        id: '5',
        title: 'ค่ายอาสาพัฒนาโรงเรียน',
        eventType: 'อาสา',
        startDate: '10/07/2568',
        endDate: '13/07/2568',
        requesterName: 'นายอนุชา มีศักดิ์ (เจ้าหน้าที่)',
        requesterId: 'staff-5',
        approvalStatus: 'รออนุมัติ',
        requestDate: '12/05/2568',
        description: 'ร่วมกันสร้างห้องสมุดและปรับปรุงสนามเด็กเล่นให้กับโรงเรียนในถิ่นทุรกันดาร',
        maxParticipants: 25
      },
      {
        id: '6',
        title: 'อบรมทักษะการนำเสนอและการพูดในที่สาธารณะ',
        eventType: 'อบรม',
        startDate: '18/07/2568',
        endDate: '19/07/2568',
        requesterName: 'นางสาวพิมพ์ใจ สุดสวย (เจ้าหน้าที่)',
        requesterId: 'staff-6',
        approvalStatus: 'ไม่อนุมัติ',
        requestDate: '15/05/2568',
        description: 'พัฒนาทักษะการนำเสนองานอย่างมืออาชีพและเทคนิคการพูดในที่สาธารณะ เพิ่มความมั่นใจในการสื่อสาร',
        maxParticipants: 35
      },
      {
        id: '7',
        title: 'งานบริจาคโลหิตเพื่อช่วยเหลือผู้ป่วย',
        eventType: 'ช่วยงาน',
        startDate: '25/07/2568',
        endDate: '25/07/2568',
        requesterName: 'นายรักดี มีเมตตา (เจ้าหน้าที่)',
        requesterId: 'staff-7',
        approvalStatus: 'อนุมัติ',
        requestDate: '18/05/2568',
        description: 'ช่วยงานรับบริจาคโลหิต ซึ่งจะนำไปช่วยเหลือผู้ป่วยในโรงพยาบาลที่ขาดแคลน',
        maxParticipants: 15
      },
      {
        id: '8',
        title: 'โครงการสอนน้อง ปันความรู้สู่ชุมชน',
        eventType: 'อาสา',
        startDate: '01/08/2568',
        endDate: '31/08/2568',
        requesterName: 'นางสาวสมใจ ใจดี (เจ้าหน้าที่)',
        requesterId: 'staff-8',
        approvalStatus: 'อนุมัติ',
        requestDate: '20/05/2568',
        description: 'ร่วมเป็นอาสาสมัครสอนวิชาคณิตศาสตร์และวิทยาศาสตร์ให้กับเด็กนักเรียนในชุมชนที่ขาดแคลนโอกาสทางการศึกษา',
        maxParticipants: 20
      }
    ];

    setEvents(mockEvents);

    // อัพเดท state ตาม URL parameter (ถ้ามี)
    if (statusParam) {
      switch (statusParam) {
        case 'approved':
          setFilterStatus('อนุมัติ');
          break;
        case 'pending':
          setFilterStatus('รออนุมัติ');
          break;
        case 'rejected':
          setFilterStatus('ไม่อนุมัติ');
          break;
        default:
          setFilterStatus('');
      }
    }
  }, [statusParam]);

  // ฟังก์ชันเรียงข้อมูล
  const sortEvents = (field: SortField) => {
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ฟังก์ชันจัดการการอนุมัติ
  const handleApprove = (id: string) => {
    const confirmed = window.confirm('คุณต้องการอนุมัติกิจกรรมนี้ใช่หรือไม่?');
    if (confirmed) {
      setEvents(events.map(event => 
        event.id === id ? { ...event, approvalStatus: 'อนุมัติ' } : event
      ));
    }
  };

  // ฟังก์ชันจัดการการปฏิเสธ
  const handleReject = (id: string) => {
    const confirmed = window.confirm('คุณต้องการปฏิเสธกิจกรรมนี้ใช่หรือไม่?');
    if (confirmed) {
      setEvents(events.map(event => 
        event.id === id ? { ...event, approvalStatus: 'ไม่อนุมัติ' } : event
      ));
    }
  };

  // ฟังก์ชันจัดรูปแบบวันที่
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    // ปรับเป็นรูปแบบ yyyy-MM-dd สำหรับ input type="date"
    const formattedDate = `${year - 543}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  };

  // ฟังก์ชันแปลงวันที่จากรูปแบบ input กลับเป็นรูปแบบที่แสดงในตาราง
  const parseDate = (dateString: string) => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-').map(Number);
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year + 543}`;
  };

  // กรองและเรียงข้อมูล
  const filteredAndSortedEvents = events
    .filter(event => {
      // กรองตามคำค้นหา
      const matchSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // กรองตามประเภทกิจกรรม
      const matchType = filterType === '' || event.eventType === filterType;
      
      // กรองตามสถานะการอนุมัติ
      const matchStatus = filterStatus === '' || event.approvalStatus === filterStatus;
      
      // กรองตามวันที่เริ่มต้น
      const matchStartDate = !filterStartDate || 
        new Date(formatDate(event.startDate)) >= new Date(filterStartDate);
      
      // กรองตามวันที่สิ้นสุด
      const matchEndDate = !filterEndDate || 
        new Date(formatDate(event.endDate)) <= new Date(filterEndDate);
      
      return matchSearch && matchType && matchStatus && matchStartDate && matchEndDate;
    })
    .sort((a, b) => {
      // เรียงตามฟิลด์ที่เลือก
      const compareA = String(a[sortField]).toLowerCase();
      const compareB = String(b[sortField]).toLowerCase();
      
      // สำหรับวันที่ ต้องแปลงเป็น Date เพื่อเปรียบเทียบที่ถูกต้อง
      if (sortField === 'startDate' || sortField === 'endDate' || sortField === 'requestDate') {
        const dateA = compareA.split('/').reverse().join('-');
        const dateB = compareB.split('/').reverse().join('-');
        return sortOrder === 'asc' 
          ? new Date(dateA).getTime() - new Date(dateB).getTime()
          : new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      
      if (compareA < compareB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (compareA > compareB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // คำนวณหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);

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

  // กำหนดสี header bar ตามธีม
  const getHeaderBarColor = () => {
    return theme === 'dark' 
      ? 'bg-blue-800' // โทนสีน้ำเงินเข้มสำหรับ Dark Mode
      : 'bg-blue-600'; // โทนสีน้ำเงินสำหรับ Light Mode
  };

  // รีเซ็ตฟิลเตอร์
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setFilterStartDate('');
    setFilterEndDate('');
    navigate('/admin/event-approval');
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">คำขออนุมัติกิจกรรม</h1>
          
          {/* ปุ่มรีเซ็ตฟิลเตอร์ - แสดงเมื่อมีการกรอง */}
          {(searchTerm || filterType || filterStatus || filterStartDate || filterEndDate) && (
            <button
              onClick={resetFilters}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                รีเซ็ตฟิลเตอร์
              </div>
            </button>
          )}
        </div>
        
        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="">ทุกสถานะการอนุมัติ</option>
              <option value="อนุมัติ">อนุมัติ</option>
              <option value="รออนุมัติ">รออนุมัติ</option>
              <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
            </select>
          </div>
        </div>
        
        {/* ฟิลเตอร์วันที่ */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className={`block mb-1 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              วันที่เริ่มต้น (ตั้งแต่)
            </label>
            <input
              type="date"
              id="startDate"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className={`block mb-1 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              วันที่สิ้นสุด (ถึง)
            </label>
            <input
              type="date"
              id="endDate"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } border`}
            />
          </div>
        </div>
        
        {/* ตารางคำขออนุมัติกิจกรรม */}
        <div className={`overflow-x-auto rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${getHeaderBarColor()} text-white`}>
              <tr>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents('title')}
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
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents('eventType')}
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
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents('startDate')}
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
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents('endDate')}
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
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents("requesterName")}
                >
                  <div className="flex items-center">
                    ชื่อผู้ขออนุมัติ
                    {sortField === "requesterName" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortEvents("requestDate")}
                >
                  <div className="flex items-center">
                    วันที่สมัคร
                    {sortField === "requestDate" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer whitespace-nowrap"
                  onClick={() => sortEvents('approvalStatus')}
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
                currentItems.map((event) => (
                  <tr key={event.id} className={`hover:${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="font-medium truncate max-w-[150px]" title={event.title}>
                        {event.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {event.startDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {event.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="truncate max-w-[150px]" title={event.requesterName}>
                        {event.requesterName}
                        <div className="text-xs text-gray-500">
                          {event.requesterId}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {event.requestDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${approvalStatusColor(event.approvalStatus)}`}>
                        {event.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ปุ่มดูรายละเอียด */}
                        <Link 
                          to={`/events/detail/${event.id}`} 
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
                        
                        {/* ปุ่มอนุมัติ - แสดงเฉพาะเมื่อสถานะเป็น "รออนุมัติ" */}
                        {event.approvalStatus === 'รออนุมัติ' && (
                          <button
                            onClick={() => handleApprove(event.id)}
                            className={`p-1 rounded-full ${
                              theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-gray-200'
                            }`}
                            title="อนุมัติ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        
                        {/* ปุ่มปฏิเสธ - แสดงเฉพาะเมื่อสถานะเป็น "รออนุมัติ" */}
                        {event.approvalStatus === 'รออนุมัติ' && (
                          <button
                            onClick={() => handleReject(event.id)}
                            className={`p-1 rounded-full ${
                              theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-200'
                            }`}
                            title="ปฏิเสธ"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    ไม่พบคำขออนุมัติกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredAndSortedEvents.length > 0 && (
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

export default EventApprovalRequestsPage;