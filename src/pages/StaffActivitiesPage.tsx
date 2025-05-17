import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.hook';
import api from '../services/api';

// ประเภทข้อมูลสำหรับกิจกรรม
interface ActivityItem {
  id: string | number;
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
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  // ดึงข้อมูลกิจกรรมจาก API
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // ดึง token จาก localStorage
      const authData = localStorage.getItem("authData");
      if (!authData) {
        setErrorMessage("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
        setIsLoading(false);
        return;
      }

      // แปลงข้อมูล auth และดึง token
      const parsedAuthData = JSON.parse(authData);
      const token = parsedAuthData.token;
      
      if (!token) {
        setErrorMessage("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
        setIsLoading(false);
        return;
      }

      console.log("กำลังดึงข้อมูลกิจกรรมที่สร้างโดยผู้ใช้...");
      
      // เรียกใช้ API เพื่อดึงข้อมูลกิจกรรมที่สร้างโดยผู้ใช้
      const response = await api.get('/api/activities/get-created', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ข้อมูลกิจกรรมที่ได้รับ:", response.data);

      if (response.data && response.data.activities) {
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ต้องการใช้
        const formattedActivities = response.data.activities.map((activity: any) => {
          // แปลง startTime และ endTime เป็นรูปแบบ DD/MM/YYYY
          const startDate = formatDateFromISO(activity.startTime);
          const endDate = formatDateFromISO(activity.endTime);
          
          // แปลงสถานะให้อยู่ในรูปแบบที่เข้าใจง่าย
          const status = mapStatusToDisplay(activity.status);
          
          // แปลงสถานะการอนุมัติ (ตามข้อมูลที่มี)
          const approvalStatus = activity.approvalStatus || 'รออนุมัติ';
          
          return {
            id: activity.id,
            title: activity.title,
            eventType: activity.type?.name || 'อบรม',
            startDate,
            endDate,
            approvalStatus,
            status,
            hours: activity.hours || 0,
            participants: activity.currentParticipants || 0,
            maxParticipants: activity.maxParticipants,
            createdBy: userId || ''
          };
        });

        setActivities(formattedActivities);
      }
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("ไม่มีสิทธิ์ในการดูข้อมูลกิจกรรม หรือ token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        } else {
          setErrorMessage(`เกิดข้อผิดพลาด: ${error.response.data?.message || error.message}`);
        }
      } else {
        setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // แปลงวันที่จาก ISO เป็นรูปแบบ DD/MM/YYYY
  const formatDateFromISO = (isoDate: string): string => {
    if (!isoDate) return '';
    
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    
    return `${day}/${month}/${year}`;
  };

  // แปลงสถานะกิจกรรมให้เป็นภาษาไทย
  const mapStatusToDisplay = (status: string): 'รับสมัคร' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก' => {
    switch (status) {
      case 'open':
        return 'รับสมัคร';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      case 'closed':
        return 'เสร็จสิ้น';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return 'รับสมัคร';
    }
  };

  // แปลงสถานะจากภาษาไทยเป็นค่าที่ส่งไป API
  const mapDisplayToStatus = (statusDisplay: string): string => {
    switch (statusDisplay) {
      case 'รับสมัคร':
        return 'open';
      case 'กำลังดำเนินการ':
        return 'in_progress';
      case 'เสร็จสิ้น':
        return 'closed';
      case 'ยกเลิก':
        return 'cancelled';
      default:
        return 'open';
    }
  };

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
  const handleCloseActivity = async (id: string | number) => {
    const confirmed = window.confirm('คุณต้องการปิดกิจกรรมนี้ใช่หรือไม่? นิสิตที่เข้าร่วมจะได้รับคะแนนและชั่วโมงกิจกรรม');
    if (confirmed) {
      try {
        // ดึง token จาก localStorage
        const authData = localStorage.getItem("authData");
        if (!authData) {
          alert("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
          return;
        }

        // แปลงข้อมูล auth และดึง token
        const parsedAuthData = JSON.parse(authData);
        const token = parsedAuthData.token;
        
        if (!token) {
          alert("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
          return;
        }

        // เรียกใช้ API เพื่อเปลี่ยนสถานะกิจกรรมเป็น 'closed'
        const response = await api.put(`/api/activities/${id}/status`, {
          status: "closed"
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("API response:", response.data);

        // อัพเดตข้อมูลในหน้าจอ
        setActivities(activities.map(activity => 
          activity.id === id ? { ...activity, status: 'เสร็จสิ้น' } : activity
        ));

        alert('ปิดกิจกรรมเรียบร้อยแล้ว');
      } catch (error: any) {
        console.error("เกิดข้อผิดพลาดในการปิดกิจกรรม:", error);
        
        if (error.response) {
          alert(`เกิดข้อผิดพลาด: ${error.response.data?.message || error.message}`);
        } else {
          alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
      }
    }
  };

  // ฟังก์ชันจัดการการยกเลิกกิจกรรม
  const handleCancelActivity = async (id: string | number) => {
    const confirmed = window.confirm('คุณต้องการยกเลิกกิจกรรมนี้ใช่หรือไม่? นิสิตที่เข้าร่วมจะไม่ได้รับคะแนนและชั่วโมงกิจกรรม');
    if (confirmed) {
      try {
        // ดึง token จาก localStorage
        const authData = localStorage.getItem("authData");
        if (!authData) {
          alert("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
          return;
        }

        // แปลงข้อมูล auth และดึง token
        const parsedAuthData = JSON.parse(authData);
        const token = parsedAuthData.token;
        
        if (!token) {
          alert("ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่");
          return;
        }

        // เรียกใช้ API เพื่อเปลี่ยนสถานะกิจกรรมเป็น 'cancelled'
        const response = await api.put(`/api/activities/${id}/status`, {
          status: "cancelled"
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("API response:", response.data);

        // อัพเดตข้อมูลในหน้าจอ
        setActivities(activities.map(activity => 
          activity.id === id ? { ...activity, status: 'ยกเลิก' } : activity
        ));

        alert('ยกเลิกกิจกรรมเรียบร้อยแล้ว');
      } catch (error: any) {
        console.error("เกิดข้อผิดพลาดในการยกเลิกกิจกรรม:", error);
        
        if (error.response) {
          alert(`เกิดข้อผิดพลาด: ${error.response.data?.message || error.message}`);
        } else {
          alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
      }
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

  if (isLoading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl">กำลังโหลดข้อมูลกิจกรรม...</p>
      </div>
    );
  }

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

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={fetchActivities}
              className="mt-2 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        )}
        
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