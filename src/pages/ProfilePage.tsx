import { useState, useEffect } from 'react';
import { useTheme } from '../stores/theme.store';
import ProfileImage from '../components/ProfileImage';
import useProfileImage from '../hooks/useProfileImage.hook';
import useUserData from '../hooks/useUserData.hook';

// Card component for displaying summary information
interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode; // ใช้ React.ReactNode แทน JSX.Element
}

// Activity type card component
interface ActivityTypeCardProps {
  title: string;
  count: number;
}

// Card component สำหรับแสดงข้อมูลสรุป
function SummaryCard({ title, value, icon }: SummaryCardProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-md`}>
      <div className="flex items-center mb-2">
        {icon}
        <h3 className={`text-lg font-semibold ml-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>{title}</h3>
      </div>
      <p className={`text-2xl font-bold ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{value}</p>
    </div>
  );
}

// Activity type card component
function ActivityTypeCard({ title, count }: ActivityTypeCardProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`flex justify-between items-center p-4 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-md`}>
      <span className={`font-medium ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</span>
      <span className={`${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{count}</span>
    </div>
  );
}

function ProfilePage() {
  const { theme } = useTheme();
  const { userData, updateUserData } = useUserData();
  const { profileImage, handleImageChange } = useProfileImage();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: userData.username,
    email: userData.email,
    phone: userData.phone,
  });

  // อัพเดทข้อมูลฟอร์มเมื่อ userData เปลี่ยนแปลง
  useEffect(() => {
    setFormData({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
    });
  }, [userData]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูลผู้ใช้ที่แก้ไข
  const saveChanges = () => {
    updateUserData({
      username: formData.username,
      email: formData.email,
      phone: formData.phone
    });
    setEditing(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          โปรไฟล์ส่วนตัว
        </h1>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard 
            title="คะแนนสะสมรวม" 
            value={userData.totalPoints} 
            icon={
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            } 
          />
          <SummaryCard 
            title="ชั่วโมงกิจกรรมรวม" 
            value={userData.totalHours} 
            icon={
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } 
          />
          <SummaryCard 
            title="จำนวนกิจกรรมที่เข้าร่วม" 
            value={userData.totalActivities} 
            icon={
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            } 
          />
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information Section */}
          <div className={`col-span-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex justify-between mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>ข้อมูลส่วนตัว</h2>
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  แก้ไขข้อมูล
                </button>
              ) : (
                <button 
                  onClick={saveChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  บันทึก
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  ชื่อผู้ใช้
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {userData.username}
                  </p>
                )}
              </div>

              {/* Student ID (Read-only) */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  รหัสนิสิต
                </label>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {userData.studentId}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  อีเมล
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {userData.email}
                  </p>
                )}
              </div>

              {/* Faculty (Read-only) */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  คณะ/วิทยาลัย
                </label>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {userData.faculty}
                </p>
              </div>

              {/* Major (Read-only) */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  สาขา
                </label>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {userData.major}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className={`block mb-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  เบอร์โทรศัพท์
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                ) : (
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {userData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image and Activity Summary */}
          <div className="col-span-1 space-y-6">
            {/* Profile Image */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 flex flex-col items-center`}>
              <ProfileImage 
                profileImage={profileImage} 
                onChange={handleImageChange} 
                size="lg"
              />
              <h3 className={`text-lg font-semibold mt-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userData.username}</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>นิสิต</p>
            </div>

            {/* Activity Participation Summary */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>จำนวนการเข้ากิจกรรม</h3>
              <div className="space-y-3">
                <ActivityTypeCard title="อบรม" count={userData.activityByType.training} />
                <ActivityTypeCard title="อาสา" count={userData.activityByType.volunteer} />
                <ActivityTypeCard title="ช่วยงาน" count={userData.activityByType.helper} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;