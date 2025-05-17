import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister.hook';
import { useAuth } from '../hooks/UseAuth.hook';

function RegisterPage() {
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    faculty: '',
    major: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { registerUser, loading, error } = useRegister();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Hide Navbar on Register page
  useEffect(() => {
    document.body.classList.add('register-page');
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.studentId) newErrors.studentId = 'กรุณากรอกรหัสนิสิต';
    else if (!/^\d{8}$/.test(formData.studentId)) 
      newErrors.studentId = 'รหัสนิสิตต้องเป็นตัวเลข 8 หลัก';
    
    if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    else if (formData.password.length < 6)
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    
    if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    
    if (!formData.firstName) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName) newErrors.lastName = 'กรุณากรอกนามสกุล';
    
    // Phone is optional, but validate format if provided
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลัก';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    if (validateForm()) {
      try {
        const result = await registerUser(formData);
        
        if (result) {
          setSuccessMessage('ลงทะเบียนสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...');
          
          // Reset form
          setFormData({
            studentId: '',
            password: '',
            confirmPassword: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            faculty: '',
            major: ''
          });
          
          // Redirect to login page after a delay
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  // List of faculties for dropdown
  const faculties = [
    'คณะเทคโนโลยีสารสนเทศและการสื่อสาร',
    'คณะเกษตรศาสตร์และทรัพยากรธรรมชาติ',
    'คณะวิทยาศาสตร์',
    'คณะวิทยาศาสตร์การแพทย์',
    'คณะวิศวกรรมศาสตร์',
    'คณะพยาบาลศาสตร์'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Register form */}
      <div className="w-full md:w-1/2 lg:w-2/3 bg-white flex flex-col items-center py-4 px-6 overflow-y-auto">
        {/* Header - Logo and system name */}
        <div className="flex items-center mb-6">
          <img 
            src="/logo.png" 
            alt="ระบบจัดการงานอาสา" 
            className="h-12 w-12"
          />
          <h1 className="text-lg font-bold text-gray-800 ml-2">ระบบจัดการงานอาสาและกิจกรรมมหาวิทยาลัย</h1>
        </div>
        
        {/* Registration form */}
        <div className="w-full max-w-2xl p-8 border-2 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-2">สมัครสมาชิกใหม่</h2>
          <p className="text-center text-gray-600 mb-6">กรอกข้อมูลเพื่อสร้างบัญชีนิสิต</p>
          
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          {/* Error from the hook */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student ID */}
              <div className="col-span-1">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสนิสิต <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="กรอกรหัสนิสิต 8 หลัก"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  maxLength={8}
                />
                {errors.studentId && (
                  <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@up.ac.th"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-span-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* First Name */}
              <div className="col-span-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="กรอกชื่อ"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="col-span-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="กรอกนามสกุล"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="col-span-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเลขโทรศัพท์
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="กรอกหมายเลขโทรศัพท์ 10 หลัก"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Faculty */}
              <div className="col-span-1">
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
                  คณะ
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- เลือกคณะ --</option>
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Major */}
              <div className="col-span-1">
                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
                  สาขาวิชา
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="กรอกสาขาวิชา"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium rounded-md`}
              >
                {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
              </button>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  มีบัญชีอยู่แล้ว? <Link to="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Blue background */}
      <div className="hidden md:block md:w-1/2 lg:w-1/3 bg-blue-500"></div>
    </div>
  );
}

export default RegisterPage;