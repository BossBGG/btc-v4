import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../stores/theme.store";
import { useAuth } from "../hooks/UseAuth.hook";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import { EventSectionCard } from "../components/layouts";
import Carousel from "../components/Carousel";
import {
  getAllActivities,
  filterApprovedActivities,
  filterActiveActivities,
} from "../services/activityService";
import LoadingPage from "./LoadingPage";

// ประเภทสำหรับฟิลเตอร์การค้นหา
interface SearchFilterType {
  id: string;
  label: string;
  checked: boolean;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  type: {
    id: number;
    name: string;
  };
  status: string;
  location: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: string;
  imageUrl: string;
}

function HomePage() {
  const { theme } = useTheme();
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilterType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [trainingActivities, setTrainingActivities] = useState<any[]>([]);
  const [volunteerActivities, setVolunteerActivities] = useState<any[]>([]);
  const [helperActivities, setHelperActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลกิจกรรมจาก API
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ดึง token จาก localStorage
        const authData = localStorage.getItem("authData");
        const token = authData ? JSON.parse(authData).token : "";

        const result = await getAllActivities(token);

        // ตรวจสอบว่ามีข้อมูลกิจกรรมหรือไม่
        if (result && result.activities && Array.isArray(result.activities)) {
          // กรองข้อมูลกิจกรรมตามเงื่อนไข
          let activities = result.activities;

          // กรณีเป็นผู้ใช้ทั่วไป (นิสิต) ให้กรองเฉพาะกิจกรรมที่ approved
          if (userRole === "student" || !isAuthenticated) {
            activities = filterApprovedActivities(activities);
          }

          // กรองกิจกรรมที่ไม่อยู่ในสถานะ closed หรือ cancelled
          activities = filterActiveActivities(activities);

          // แยกกิจกรรมตามประเภท
          const training = activities.filter(
            (activity: Activity) => activity.type.id === 1
          );
          const volunteer = activities.filter(
            (activity: Activity) => activity.type.id === 2
          );
          const helper = activities.filter(
            (activity: Activity) => activity.type.id === 3
          );

          setAllActivities(activities);
          setTrainingActivities(training);
          setVolunteerActivities(volunteer);
          setHelperActivities(helper);

          // กำหนดกิจกรรมที่จะแสดงตาม tab ที่เลือก
          updateFilteredActivities(
            activeTab,
            activities,
            training,
            volunteer,
            helper
          );
        } else {
          // กรณีไม่พบข้อมูลกิจกรรม
          setAllActivities([]);
          setTrainingActivities([]);
          setVolunteerActivities([]);
          setHelperActivities([]);
          setFilteredActivities([]);
          setError("ไม่พบข้อมูลกิจกรรม");
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม กรุณาลองใหม่อีกครั้ง");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [isAuthenticated, userRole]);

  // อัปเดตกิจกรรมที่กรองแล้วตาม tab ที่เลือก
  const updateFilteredActivities = (
    tab: string,
    all: any[] = allActivities,
    training: any[] = trainingActivities,
    volunteer: any[] = volunteerActivities,
    helper: any[] = helperActivities
  ) => {
    if (tab === "all") {
      setFilteredActivities(all);
    } else if (tab === "training") {
      setFilteredActivities(training);
    } else if (tab === "volunteer") {
      setFilteredActivities(volunteer);
    } else if (tab === "helper") {
      setFilteredActivities(helper);
    }
  };

  // รูปภาพสำหรับ Carousel
  const carouselImages = [
    {
      src: "/uxui.png",
      alt: "กิจกรรมที่ 1",
      caption: "crin X เม.พะเยา ร่วมสร้างนักพัฒนาเกมบนมือถือผ่านสากล",
    },
    {
      src: "/uxui.png",
      alt: "กิจกรรมที่ 2",
      caption: "อบรมการเขียนโปรแกรม Python",
    },
    {
      src: "/uxui.png",
      alt: "กิจกรรมที่ 3",
      caption: "ปลูกป่าชายเลนเพื่อโลกสีเขียว",
    },
    {
      src: "/uxui.png",
      alt: "กิจกรรมที่ 4",
      caption: "งานวิ่งการกุศล Run for Wildlife",
    },
    {
      src: "/uxui.png",
      alt: "กิจกรรมที่ 5",
      caption: "อบรมปฐมพยาบาลเบื้องต้น",
    },
  ];

  // ฟังก์ชันสำหรับการจัดการการค้นหา
  const handleSearch = (query: string, filters: SearchFilterType[]) => {
    setIsLoading(true); // เริ่มแสดง loading

    // จำลองการโหลดข้อมูลเมื่อค้นหา
    setTimeout(() => {
      setSearchQuery(query);
      setSearchFilters(filters);
      setIsLoading(false);

      // นำทางไปยังหน้าค้นหาพร้อมพารามิเตอร์
      const searchParams = new URLSearchParams();
      if (query) searchParams.set("q", query);

      // ตรวจสอบฟิลเตอร์ที่เลือก
      filters.forEach((filter) => {
        if (filter.checked) {
          searchParams.set(filter.id, "true");
        }
      });

      navigate(`/search?${searchParams.toString()}`);
    }, 500);
  };

  // ฟังก์ชันเปลี่ยนแท็บที่เลือก
  const handleTabChange = (tab: string) => {
    setIsLoading(true); // เริ่มแสดง loading

    // จำลองการโหลดข้อมูลเมื่อเปลี่ยนแท็บ
    setTimeout(() => {
      setActiveTab(tab);
      updateFilteredActivities(tab);
      setIsLoading(false);
    }, 500);
  };

  // แสดง LoadingPage ถ้ากำลังโหลดข้อมูล
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Search Bar */}
      <SearchBar className="px-6 py-4" onSearch={handleSearch} />

      <div className="p-6 pb-12">
        {/* หัวข้อหลัก */}
        <h1
          className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          กิจกรรมของมหาวิทยาลัย
        </h1>

        {/* Carousel */}
        <div className="mb-8">
          <Carousel
            images={carouselImages}
            autoPlay={true}
            interval={5000}
            showIndicators={true}
            showArrows={true}
          />
        </div>

        {/* แสดงข้อความกรณีเกิดข้อผิดพลาด */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-md ${
              theme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* แท็บเลือกประเภทกิจกรรม */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "all"
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => handleTabChange("training")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "training"
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
          >
            อบรม
          </button>
          <button
            onClick={() => handleTabChange("volunteer")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "volunteer"
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
          >
            อาสา
          </button>
          <button
            onClick={() => handleTabChange("helper")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeTab === "helper"
                ? theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
          >
            ช่วยงาน
          </button>
        </div>

        {/* แสดงกิจกรรมตามแท็บที่เลือก */}
        {activeTab === "all" ? (
          <>
            {trainingActivities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  กิจกรรม <span className="ml-2 text-blue-600">อบรม</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainingActivities.slice(0, 3).map((activity) => (
                    <EventCard key={activity.id} {...activity} />
                  ))}
                </div>
                {trainingActivities.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate("/events/training")}
                      className={`px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      ดูเพิ่มเติม
                    </button>
                  </div>
                )}
              </div>
            )}

            {volunteerActivities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  กิจกรรม <span className="ml-2 text-green-600">อาสา</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {volunteerActivities.slice(0, 3).map((activity) => (
                    <EventCard key={activity.id} {...activity} />
                  ))}
                </div>
                {volunteerActivities.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate("/events/volunteer")}
                      className={`px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      ดูเพิ่มเติม
                    </button>
                  </div>
                )}
              </div>
            )}

            {helperActivities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  กิจกรรม <span className="ml-2 text-purple-600">ช่วยงาน</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helperActivities.slice(0, 3).map((activity) => (
                    <EventCard key={activity.id} {...activity} />
                  ))}
                </div>
                {helperActivities.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => navigate("/events/helper")}
                      className={`px-4 py-2 rounded-md ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      ดูเพิ่มเติม
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <EventCard key={activity.id} {...activity} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p
                  className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ไม่พบกิจกรรมในหมวดหมู่นี้
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
