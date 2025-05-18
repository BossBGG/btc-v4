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
import api from '../services/api';
import { useAuth } from '../hooks/UseAuth.hook';
import { getPendingApprovals, updateApprovalStatus, ApprovalRequest } from '../services/get_activitys_staff';


// Mock data for dashboard
// ประเภทข้อมูลสำหรับกิจกรรม
interface ActivityItem {
  id: string | number;
  title: string;
  eventType: "อบรม" | "อาสา" | "ช่วยงาน";
  startDate: string;
  endDate: string;
  approvalStatus: "อนุมัติ" | "รออนุมัติ" | "ไม่อนุมัติ";
  status: "รับสมัคร" | "กำลังดำเนินการ" | "เสร็จสิ้น" | "ยกเลิก";
  hours: number;
  participants: number;
  maxParticipants: number;
  createdBy: string;
}

interface ApprovalRequest {
  id: string;
  studentName: string;
  studentId: string;
  eventId: string;
  eventTitle: string;
  requestDate: string;
  status: "รอการอนุมัติ" | "อนุมัติ" | "ปฏิเสธ";
}



// Mock data for popular activities
const mockPopularActivities = [
  { id: "1", title: "BootCampCPE", count: 25 },
  { id: "2", title: "ปลูกป่าชายเลนเพื่อโลกสีเขียว", count: 22 },
  { id: "3", title: "งานวิ่งการกุศล Run for Wildlife", count: 18 },
];

// Mock data for top participants
const mockTopParticipants = [
  { id: "1", name: "นายสมชาย ใจดี", count: 15, activityId: "1" },
  { id: "2", name: "นางสาวสมหญิง รักเรียน", count: 12, activityId: "2" },
  { id: "3", name: "นายวิชัย เก่งกาจ", count: 8, activityId: "3" },
];

function StaffDashboardPage() {
  const { theme } = useTheme();
  const { userId } = useAuth();

  const [popularActivities, setPopularActivities] = useState(
    mockPopularActivities
  );
  const [topParticipants, setTopParticipants] = useState(mockTopParticipants);
  // เปลี่ยนจากใช้ข้อมูลจำลองเป็นข้อมูลจาก API
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(
    []
  );
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);
  const [approvalsError, setApprovalsError] = useState<string | null>(null);

  // Count activity types for pie chart
  const activityTypeCount = {
    อบรม: activities.filter((a) => a.eventType === "อบรม").length,
    อาสา: activities.filter((a) => a.eventType === "อาสา").length,
    ช่วยงาน: activities.filter((a) => a.eventType === "ช่วยงาน").length,
  };

  // Handle approval
  const handleApproval = async (
    requestId: string,
    activityId: string,
    registrationId: string,
    isApproved: boolean
  ) => {
    try {
      const status = isApproved ? "approved" : "rejected";
      const success = await updateApprovalStatus(
        activityId,
        registrationId,
        status
      );

      if (success) {
        // อัพเดทรายการขออนุมัติในหน้า Dashboard
        setApprovalRequests((prev) =>
          prev.filter((req) => req.registrationId !== registrationId)
        );

        // แจ้งเตือนสำเร็จ
        alert(
          isApproved
            ? "อนุมัติการเข้าร่วมกิจกรรมเรียบร้อยแล้ว"
            : "ปฏิเสธการเข้าร่วมกิจกรรมเรียบร้อยแล้ว"
        );
      } else {
        alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error handling approval:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลคำขออนุมัติ
  const fetchApprovalRequests = async () => {
    try {
      setIsLoadingApprovals(true);
      setApprovalsError(null);

      const pendingRequests = await getPendingApprovals();
      setApprovalRequests(pendingRequests.slice(0, 5)); // แสดงเฉพาะ 5 รายการแรกในหน้า Dashboard
    } catch (error) {
      console.error("Error fetching approval requests:", error);
      setApprovalsError("เกิดข้อผิดพลาดในการดึงข้อมูลคำขออนุมัติ");
    } finally {
      setIsLoadingApprovals(false);
    }
  };

  // ดึงข้อมูลกิจกรรมจาก API เมื่อ component ถูกโหลด
  useEffect(() => {
    fetchActivities();
    etchApprovalRequests();
  }, [userId]);

  // ฟังก์ชันดึงข้อมูลกิจกรรมจาก API
  const fetchActivities = async () => {
    try {
      setIsLoadingActivities(true);
      setErrorMessage(null);

      // ดึง token จาก localStorage
      const authData = localStorage.getItem("authData");
      if (!authData) {
        setErrorMessage("ไม่พบข้อมูลการเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่");
        setIsLoadingActivities(false);
        return;
      }

      // แปลงข้อมูล auth และดึง token
      const parsedAuthData = JSON.parse(authData);
      const token = parsedAuthData.token;

      if (!token) {
        setErrorMessage(
          "ไม่พบ token สำหรับการยืนยันตัวตน กรุณาเข้าสู่ระบบใหม่"
        );
        setIsLoadingActivities(false);
        return;
      }

      console.log("กำลังดึงข้อมูลกิจกรรมที่สร้างโดยผู้ใช้สำหรับแดชบอร์ด...");

      // เรียกใช้ API เพื่อดึงข้อมูลกิจกรรมที่สร้างโดยผู้ใช้
      const response = await api.get("/api/activities/get-created", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ข้อมูลกิจกรรมที่ได้รับสำหรับแดชบอร์ด:", response.data);

      if (response.data && response.data.activities) {
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ต้องการใช้
        const formattedActivities = response.data.activities.map(
          (activity: any) => {
            // แปลง startTime และ endTime เป็นรูปแบบ DD/MM/YYYY
            const startDate = formatDateFromISO(activity.startTime);
            const endDate = formatDateFromISO(activity.endTime);

            // แปลงสถานะให้อยู่ในรูปแบบที่เข้าใจง่าย
            const status = mapStatusToDisplay(activity.status);

            // แปลงสถานะการอนุมัติ (ตามข้อมูลที่มี)
            const approvalStatus = activity.approvalStatus || "รออนุมัติ";

            return {
              id: activity.id,
              title: activity.title,
              eventType: activity.type?.name || "อบรม",
              startDate,
              endDate,
              approvalStatus,
              status,
              hours: activity.hours || 0,
              participants: activity.currentParticipants || 0,
              maxParticipants: activity.maxParticipants,
              createdBy: userId || "",
            };
          }
        );

        // จัดเรียงเพื่อแสดงกิจกรรมล่าสุดก่อน
        formattedActivities.sort((a: any, b: any) => {
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        });

        setActivities(formattedActivities);
      }
    } catch (error: any) {
      console.error(
        "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมสำหรับแดชบอร์ด:",
        error
      );

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage(
            "ไม่มีสิทธิ์ในการดูข้อมูลกิจกรรม หรือ token หมดอายุ กรุณาเข้าสู่ระบบใหม่"
          );
        } else {
          setErrorMessage(
            `เกิดข้อผิดพลาด: ${error.response.data?.message || error.message}`
          );
        }
      } else {
        setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // แปลงวันที่จาก ISO เป็นรูปแบบ DD/MM/YYYY
  const formatDateFromISO = (isoDate: string): string => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.

    return `${day}/${month}/${year}`;
  };

  // แปลงสถานะกิจกรรมให้เป็นภาษาไทย
  const mapStatusToDisplay = (
    status: string
  ): "รับสมัคร" | "กำลังดำเนินการ" | "เสร็จสิ้น" | "ยกเลิก" => {
    switch (status) {
      case "open":
        return "รับสมัคร";
      case "in_progress":
        return "กำลังดำเนินการ";
      case "closed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      default:
        return "รับสมัคร";
    }
  };

  // สีประเภทกิจกรรม
  const eventTypeColor = (type: string) => {
    switch (type) {
      case "อบรม":
        return theme === "dark"
          ? "bg-blue-600 text-white"
          : "bg-blue-600 text-white";
      case "อาสา":
        return theme === "dark"
          ? "bg-green-600 text-white"
          : "bg-green-600 text-white";
      case "ช่วยงาน":
        return theme === "dark"
          ? "bg-purple-600 text-white"
          : "bg-purple-600 text-white";
      default:
        return "";
    }
  };

  // สีสถานะการอนุมัติ
  const approvalStatusColor = (status: string) => {
    switch (status) {
      case "อนุมัติ":
        return theme === "dark" ? "text-green-400" : "text-green-600";
      case "รออนุมัติ":
        return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
      case "ไม่อนุมัติ":
        return theme === "dark" ? "text-red-400" : "text-red-600";
      default:
        return "";
    }
  };

  // สีสถานะกิจกรรม
  const activityStatusColor = (status: string) => {
    switch (status) {
      case "รับสมัคร":
        return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
      case "กำลังดำเนินการ":
        return theme === "dark" ? "text-blue-400" : "text-blue-600";
      case "เสร็จสิ้น":
        return theme === "dark" ? "text-green-400" : "text-green-600";
      case "ยกเลิก":
        return theme === "dark" ? "text-red-400" : "text-red-600";
      default:
        return "";
    }
  };

  // แสดงผล Activities Table Card
  const renderApprovalRequestsCard = () => {
    return (
      <DashboardCard
        title="ผู้ขออนุมัติเข้าร่วมกิจกรรม"
        action={{ label: "ดูทั้งหมด", to: "/staff/approval-requests" }}
      >
        {isLoadingApprovals ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-2">กำลังโหลดข้อมูล...</p>
          </div>
        ) : approvalsError ? (
          <div className="py-4 text-center">
            <p className="text-red-500">{approvalsError}</p>
            <button
              onClick={fetchApprovalRequests}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ลองใหม่
            </button>
          </div>
        ) : approvalRequests.length === 0 ? (
          <div className="py-4 text-center">
            <p>ไม่มีคำขออนุมัติเข้าร่วมกิจกรรมในขณะนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead
                className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    ชื่อผู้สมัคร
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    ชื่อกิจกรรม
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    เวลาที่สมัคร
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    สถานะ
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-center text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${
                  theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {approvalRequests.map((request) => (
                  <tr
                    key={request.registrationId}
                    className={`${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
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
                        onApprove={() =>
                          handleApproval(
                            request.id,
                            request.activityId,
                            request.registrationId,
                            true
                          )
                        }
                        onReject={() =>
                          handleApproval(
                            request.id,
                            request.activityId,
                            request.registrationId,
                            false
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    );
  };
  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            แดชบอร์ดเจ้าหน้าที่
          </h1>
          <div className="flex space-x-4">
            <Link
              to="/create-event"
              className={`px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium transition-colors flex items-center`}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
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
              <PieChart
                data={[
                  {
                    label: "อบรม",
                    value: activityTypeCount["อบรม"],
                    color: "#3B82F6",
                  },
                  {
                    label: "อาสา",
                    value: activityTypeCount["อาสา"],
                    color: "#10B981",
                  },
                  {
                    label: "ช่วยงาน",
                    value: activityTypeCount["ช่วยงาน"],
                    color: "#8B5CF6",
                  },
                ]}
              />

              {/* Legend */}
              <div className="ml-0 md:ml-8 mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span>อบรม: {activityTypeCount["อบรม"]}</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>อาสา: {activityTypeCount["อาสา"]}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span>ช่วยงาน: {activityTypeCount["ช่วยงาน"]}</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Participants Bar Chart Card */}
          <DashboardCard title="จำนวนผู้เข้าร่วมกิจกรรมของฉัน">
            <div className="h-64">
              <BarChart
                data={activities.slice(0, 5).map((activity) => ({
                  label: activity.title,
                  value: activity.participants,
                  color:
                    activity.eventType === "อบรม"
                      ? "#3B82F6"
                      : activity.eventType === "อาสา"
                      ? "#10B981"
                      : "#8B5CF6",
                }))}
                maxValue={Math.max(...activities.map((a) => a.participants))}
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
          <DashboardSummaryCard title="กิจกรรมของฉันที่มีคนข้าร่วมมากที่สุด">
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
          <DashboardSummaryCard title="ผู้เข้าร่วมกิจกรรมของฉันมากที่สุด">
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
          {renderActivitiesTableCard()}

          {/* Activities & Approval Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activities Table Card */}
            {renderActivitiesTableCard()}

            {/* Approval Requests Card */}
            {renderApprovalRequestsCard()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboardPage;
