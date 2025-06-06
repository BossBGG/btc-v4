import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../stores/theme.store";
import { 
  getActivitiesApi, 
  getPendingApprovals, 
  updateApprovalStatus,
  ApprovalRequest
} from "../services/get_activitys_staff";

// ประเภทสำหรับการเรียงข้อมูล
type SortField =
  | "studentName"
  | "studentId"
  | "faculty"
  | "major"
  | "requestDate"
  | "status"
  | "eventTitle"
  | "eventType";
  
type SortOrder = "asc" | "desc";

function ApprovalRequestsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("requestDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterType, setFilterType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchApprovalRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pendingRequests = await getPendingApprovals();
      setApprovalRequests(pendingRequests);
    } catch (err) {
      console.error("Error fetching approval requests:", err);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  //สีประเภทกิจกรรม
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

  // ฟังก์ชันเรียงข้อมูล
  const sortRequests = (field: SortField) => {
    if (sortField === field) {
      // ถ้าคลิกที่ฟิลด์เดิม ให้สลับลำดับการเรียง
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // ถ้าคลิกที่ฟิลด์ใหม่ ให้เรียงจากน้อยไปมาก
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนสถานะการเข้าร่วม
  const handleAttendanceChange = async (
    id: string,
    registerId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const success = await updateApprovalStatus(id, registerId, status);
      
      if (success) {
        // อัพเดทสถานะในรายการของเรา
        setApprovalRequests(prevRequests => 
          prevRequests.filter(request => request.registrationId !== registerId)
        );
        
        // แจ้งเตือนว่าได้ดำเนินการเรียบร้อยแล้ว
        if (status === "approved") {
          alert(`อนุมัติการเข้าร่วมกิจกรรมเรียบร้อยแล้ว`);
        } else {
          alert(`ปฏิเสธการเข้าร่วมกิจกรรมเรียบร้อยแล้ว`);
        }
      } else {
        alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("Error updating approval status:", err);
      alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ กรุณาลองใหม่อีกครั้ง");
    }
  };

  // ส่วนของการกรองข้อมูลก่อนแสดงผล
  const filteredAndSortedRequests = approvalRequests
    .filter(
      (request) =>
        (request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.studentId.includes(searchTerm) ||
          request.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === "" || request.status === filterType)
    )
    .sort((a, b) => {
      // ตัวอย่างการเรียงข้อมูลตามฟิลด์ที่เลือก
      if (sortField === "studentName") {
        return sortOrder === "asc"
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName);
      } else if (sortField === "studentId") {
        return sortOrder === "asc"
          ? a.studentId.localeCompare(b.studentId)
          : b.studentId.localeCompare(a.studentId);
      } else if (sortField === "eventTitle") {
        return sortOrder === "asc"
          ? a.eventTitle.localeCompare(b.eventTitle)
          : b.eventTitle.localeCompare(a.eventTitle);
      } else if (sortField === "requestDate") {
        // แปลงวันที่เป็น timestamp เพื่อเปรียบเทียบ
        const dateA = new Date(a.requestDate.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.requestDate.split('/').reverse().join('-')).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      // ถ้าไม่ตรงกับเงื่อนไขข้างต้น ให้เรียงตาม requestDate
      return 0;
    });

  // คำนวณหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    filteredAndSortedRequests.length / itemsPerPage
  );

  // สีสถานะการเข้าร่วม
  const attendanceStatusColor = (status: string) => {
    switch (status) {
      case "อนุมัติ":
        return theme === "dark" ? "text-green-400" : "text-green-600";
      case "ปฏิเสธ":
        return theme === "dark" ? "text-red-400" : "text-red-600";
      case "รอการอนุมัติ":
        return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
      default:
        return "";
    }
  };

  // กำหนดสี header bar ตามธีม
  const getHeaderBarColor = () => {
    return theme === "dark"
      ? "bg-blue-800" // โทนสีน้ำเงินเข้มสำหรับ Dark Mode
      : "bg-blue-600"; // โทนสีน้ำเงินสำหรับ Light Mode
  };

  // แสดง loading ขณะโหลดข้อมูล
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto">
        {/* ส่วนหัวของหน้า - แสดงข้อมูลกิจกรรม */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate("/staff/activities")}
              className={`mr-4 p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">ผู้ขออนุมัติเข้าร่วมกิจกรรม</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={fetchApprovalRequests}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* ส่วนค้นหาและตัวกรอง */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาผู้เข้าร่วม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } border`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } border`}
            >
              <option value="">ทุกสถานะ</option>
              <option value="รอการอนุมัติ">รอการอนุมัติ</option>
              <option value="อนุมัติ">อนุมัติ</option>
              <option value="ปฏิเสธ">ปฏิเสธ</option>
            </select>
          </div>
        </div>

        {/* ตารางแสดงรายชื่อผู้เข้าร่วม */}
        <div
          className={`overflow-x-auto rounded-lg border ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${getHeaderBarColor()} text-white`}>
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortRequests("studentName")}
                >
                  <div className="flex items-center">
                    ชื่อผู้สมัคร
                    {sortField === "studentName" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortRequests("studentId")}
                >
                  <div className="flex items-center">
                    รหัสนิสิต
                    {sortField === "studentId" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortRequests("eventTitle")}
                >
                  <div className="flex items-center">
                    ชื่อกิจกรรม
                    {sortField === "eventTitle" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortRequests("requestDate")}
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
                  className="px-4 py-3 text-left text-sm font-medium cursor-pointer"
                  onClick={() => sortRequests("status")}
                >
                  <div className="flex items-center">
                    สถานะการเข้าร่วม
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center text-sm font-medium"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === "dark"
                  ? "divide-gray-700 bg-gray-800"
                  : "divide-gray-200 bg-white"
              }`}
            >
              {currentItems.length > 0 ? (
                currentItems.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`hover:${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {request.studentName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {request.studentId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div
                        className="truncate max-w-[150px]"
                        title={request.eventTitle}
                      >
                        {request.eventTitle}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {request.requestDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`font-medium ${attendanceStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* ปุ่มอนุมัติ */}
                        <button
                          onClick={() =>
                            handleAttendanceChange(
                              request.activityId, 
                              request.registrationId, 
                              "approved"
                            )
                          }
                          className={`p-1 rounded-full ${
                            theme === "dark"
                              ? "text-green-400 hover:bg-gray-700"
                              : "text-green-600 hover:bg-gray-200"
                          }`}
                          title="อนุมัติ"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>

                        {/* ปุ่มปฏิเสธ */}
                        <button
                          onClick={() =>
                            handleAttendanceChange(
                              request.activityId,
                              request.registrationId,
                              "rejected"
                            )
                          }
                          className={`p-1 rounded-full ${
                            theme === "dark"
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-gray-200"
                          }`}
                          title="ปฏิเสธ"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm font-medium"
                  >
                    ไม่พบรายชื่อผู้เข้าร่วมกิจกรรมที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAndSortedRequests.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                }
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                } ${
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
                aria-label="Previous page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
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
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                        : theme === "dark"
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                } ${
                  theme === "dark"
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
                aria-label="Next page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalRequestsPage;