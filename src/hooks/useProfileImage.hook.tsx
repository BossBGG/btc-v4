import { useState, useEffect } from 'react';

/**
 * Custom hook to manage profile image state across components
 * @returns {Object} Profile image state and functions
 */
export function useProfileImage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage on hook initialization
  useEffect(() => {
    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }
    
    // Listen for profile image changes from other components
    const handleStorageChange = () => {
      const updatedProfileImage = localStorage.getItem('profileImage');
      setProfileImage(updatedProfileImage);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleProfileImageChange = (event: CustomEvent) => {
      setProfileImage(event.detail.profileImage);
    };
    
    window.addEventListener('profileImageChange', handleProfileImageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileImageChange', handleProfileImageChange as EventListener);
    };
  }, []);

  // Function to update profile image
  const updateProfileImage = (imageUrl: string) => {
    setProfileImage(imageUrl);
    
    // Save to localStorage for persistence
    localStorage.setItem('profileImage', imageUrl);
    
    // Dispatch a custom event for same-tab communication with other components
    const profileImageChangeEvent = new CustomEvent('profileImageChange', {
      detail: { profileImage: imageUrl }
    });
    window.dispatchEvent(profileImageChangeEvent);
  };

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        updateProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    profileImage,
    updateProfileImage,
    handleImageChange
  };
}

export default useProfileImage;