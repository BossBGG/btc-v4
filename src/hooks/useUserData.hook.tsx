import { useState, useEffect } from 'react';

// Define the user data type
export interface UserData {
  username: string;
  email: string;
  studentId: string;
  faculty: string;
  major: string;
  phone: string;
  totalPoints: number;
  totalHours: number;
  totalActivities: number;
  activityByType: {
    training: number;
    volunteer: number;
    helper: number;
  };
}

// Mock data for initial user
const mockUserData: UserData = {
  username: 'John Doe',
  email: '65015368@up.ac.th',
  studentId: '65015368',
  faculty: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร',
  major: 'สาขาวิชาวิศวกรรมคอมพิวเตอร์',
  phone: '0814581569',
  totalPoints: 100,
  totalHours: 48,
  totalActivities: 10,
  activityByType: {
    training: 15,
    volunteer: 8,
    helper: 9
  }
};

/**
 * Custom hook to manage user data
 * @returns {Object} User data state and functions
 */
export function useUserData() {
  const [userData, setUserData] = useState<UserData>(mockUserData);

  // Load user data from localStorage when the hook initializes
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }
    
    // Listen for user data changes from other components
    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem('userData');
      if (updatedUserData) {
        try {
          const parsedData = JSON.parse(updatedUserData);
          setUserData(parsedData);
        } catch (e) {
          console.error('Failed to parse user data from localStorage during storage event', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleUserDataChange = (event: CustomEvent) => {
      setUserData(event.detail.userData);
    };
    
    window.addEventListener('userDataChange', handleUserDataChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChange', handleUserDataChange as EventListener);
    };
  }, []);

  // Function to update user data
  const updateUserData = (newData: Partial<UserData>) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    
    // Save to localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    // Dispatch a custom event for same-tab communication
    const userDataChangeEvent = new CustomEvent('userDataChange', {
      detail: { userData: updatedData }
    });
    window.dispatchEvent(userDataChangeEvent);
  };

  return {
    userData,
    updateUserData
  };
}

export default useUserData;