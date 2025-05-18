import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../stores/theme.store";
import { useAuth } from "../hooks/UseAuth.hook";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import { EventSectionCard } from "../components/layouts";
import Carousel from "../components/Carousel";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import {
  DraggableCardContainer,
  DraggableCardBody,
} from "../components/ui/draggable-card";
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
// ข้อมูลจำลองสำหรับ AnimatedTestimonials
const topStudents = [
  {
    quote: "คะแนนสะสม: 100 คะแนน | ICT | CPE",
    name: "Boss1",
    designation: "อันดับที่ 1",
    src: "/image1.png",
  },
  {
    quote: "คะแนนสะสม: 90 คะแนน | ICT | CPE",
    name: "Boss2",
    designation: "อันดับที่ 2",
    src: "/image1.png",
  },
  {
    quote: "คะแนนสะสม: 80 คะแนน | ICT | CPE",
    name: "Boss3",
    designation: "อันดับที่ 3",
    src: "/image1.png",
  },
  {
    quote: "คะแนนสะสม: 70 คะแนน | ICT | CPE",
    name: "Boss4",
    designation: "อันดับที่ 4",
    src: "/image1.png",
  },
  {
    quote: "คะแนนสะสม: 60 คะแนน | ICT | CPE",
    name: "Boss5",
    designation: "อันดับที่ 5",
    src: "/image1.png",
  },
];

// ข้อมูลจำลองสำหรับ DraggableCard
const topEvents = [
  {
    id: 1,
    title: "Express Training",
    organizer: "INET",
    participants: 50,
    image: "/inet2.png",
  },
  {
    id: 2,
    title: "C# & .NAT Training",
    organizer: "Online asset",
    participants: 40,
    image: "/cws.png",
  },
  {
    id: 3,
    title: "Basic JavaScript",
    organizer: "INET",
    participants: 30,
    image: "/inet1.png",
  },
  {
    id: 4,
    title: "UX/UI Design Training",
    organizer: "IIG",
    participants: 20,
    image: "uxui.png",
  },
  {
    id: 5,
    title: "SQL & NoSQL Training",
    organizer: "Online asset",
    participants: 10,
    image: "/snd.png",
  },
];

type EventType = {
  image: string;
  title: string;
  organizer: string;
  participants: number;
};

interface TopEventCardProps {
  event: EventType;
  rank: number;
}

const TopEventCard: React.FC<TopEventCardProps> = ({ event, rank }) => {
  const { theme } = useTheme();

  return (
    <DraggableCardContainer className="mx-auto my-4">
      <DraggableCardBody
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } w-64 h-96 p-6 relative overflow-hidden`}
      >
        {/* เนื้อหาการ์ด */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center mb-4">
            <span
              className={`text-lg font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              อันดับที่ {rank}
            </span>
          </div>

          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-32 object-cover"
            />
          </div>

          <h3
            className={`text-lg font-semibold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {event.title}
          </h3>

          <div
            className={`text-sm mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            ผู้จัด: {event.organizer}
          </div>

          <div className="mt-auto">
            <div
              className={`text-base font-medium ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              ผู้เข้าร่วม: {event.participants} คน
            </div>
          </div>
        </div>
      </DraggableCardBody>
    </DraggableCardContainer>
  );
};

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
        let token = "";

        if (authData) {
          try {
            const parsedAuthData = JSON.parse(authData);
            if (parsedAuthData && parsedAuthData.token) {
              token = parsedAuthData.token;
              console.log(
                "Using token from authData:",
                token.substring(0, 10) + "..."
              );
            }
          } catch (e) {
            console.error("Failed to parse auth data:", e);
          }
        } else {
          console.log("No auth data found in localStorage");
        }

        // ถ้ายังไม่ได้ login เราอาจจะต้องแสดงกิจกรรมที่เปิดเผยต่อสาธารณะ
        // หรือเราอาจจะต้องแสดงข้อความให้ login ก่อน
        const result = await getAllActivities(token);
        console.log("API result:", result);

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
          console.log("No activities found in API response");
          setAllActivities([]);
          setTrainingActivities([]);
          setVolunteerActivities([]);
          setHelperActivities([]);
          setFilteredActivities([]);

          // ถ้ามี error message จาก API
          if (result && result.error) {
            setError(result.error);
          } else {
            setError("ไม่พบข้อมูลกิจกรรม");
          }
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

  // แสดงข้อความ error ถ้าไม่สามารถโหลดข้อมูลได้
  if (
    error &&
    !allActivities.length &&
    !trainingActivities.length &&
    !volunteerActivities.length &&
    !helperActivities.length
  ) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <SearchBar className="px-6 py-4" onSearch={handleSearch} />
        <div className="p-6 pb-12">
          <h1
            className={`text-2xl font-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            กิจกรรมของมหาวิทยาลัย
          </h1>

          <div
            className={`mb-6 p-4 rounded-lg ${
              theme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-700"
            }`}
          >
            <p className="mb-2 font-medium">ไม่สามารถโหลดข้อมูลกิจกรรมได้</p>
            <p>{error}</p>
            {!isAuthenticated && (
              <div className="mt-4">
                <p className="mb-2">
                  คุณอาจจะยังไม่ได้เข้าสู่ระบบ
                  โปรดเข้าสู่ระบบเพื่อดูกิจกรรมทั้งหมด
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className={`px-4 py-2 ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-md`}
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            )}
          </div>

          <div className="mb-8">
            <Carousel
              images={carouselImages}
              autoPlay={true}
              interval={5000}
              showIndicators={true}
              showArrows={true}
            />
          </div>
        </div>
      </div>
    );
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

        {/* นิสิตที่มีคะแนนสะสมมากที่สุด */}
        <div className="mb-12">
          <h2
            className={`text-xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            นิสิตที่มีคะแนนสะสมมากที่สุด
          </h2>

          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <AnimatedTestimonials testimonials={topStudents} autoplay={true} />
          </div>
        </div>

        {/* กิจกรรมที่มีคนเข้าร่วมมากที่สุด */}
        <div className="mb-12">
          <h2
            className={`text-xl font-bold mb-6 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            กิจกรรมที่มีคนเข้าร่วมมากที่สุด
          </h2>

          <div className="relative r  ">
            {/* ข้อความพื้นหลัง */}
            <div
              className="absolute inset-0 flex flex-col justify-center items-cednter opacity-10 pointer-events-none select-none mt-38 ml-96"
              style={{ zIndex: 0 }}
            >
              <div className="text-6xl font-bold text-black mb-8">
                GOOD EVENT
              </div>
              <div className="text-6xl font-bold text-black mb-8">
                GOOD TRAINING
              </div>
              <div className="text-6xl font-bold text-black">GOOD SKILL</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {topEvents.map((event, index) => (
              <TopEventCard key={event.id} event={event} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* แท็บเลือกประเภทกิจกรรม */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("all")}
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
            onClick={() => setActiveTab("training")}
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
            onClick={() => setActiveTab("volunteer")}
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
            onClick={() => setActiveTab("helper")}
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

            {/* กรณีไม่มีกิจกรรมใดๆ ให้แสดงข้อความ */}
            {trainingActivities.length === 0 &&
              volunteerActivities.length === 0 &&
              helperActivities.length === 0 && (
                <div className="text-center py-10">
                  <p
                    className={`text-lg ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ไม่พบกิจกรรมในขณะนี้
                  </p>
                  {!isAuthenticated && (
                    <div className="mt-4">
                      <p className="mb-2">
                        คุณอาจจะยังไม่ได้เข้าสู่ระบบ
                        โปรดเข้าสู่ระบบเพื่อดูกิจกรรมทั้งหมด
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className={`px-4 py-2 ${
                          theme === "dark"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        } text-white rounded-md`}
                      >
                        เข้าสู่ระบบ
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
