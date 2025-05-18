import api from './api';

export interface ParticipantItem {
  activityId: string;
  userId: string;
  registrationId: string;
  fullName: string;
  studentId: string;
  activityType: 'อบรม' | 'อาสา' | 'ช่วยงาน';
  activityName: string;
  facultyName: string;
  majorName: string;
  registrationDate: string;
  registrationStatus: "approved" | "rejected" | "pending";
}

export interface ParticipantsResponse {
  participants: ParticipantItem[];
  total: number;
  message?: string;
}

export interface ApprovalRequest {
  id: string;
  activityId: string;
  userId: string;
  registrationId: string;
  studentName: string;
  studentId: string;
  eventId: string;
  eventTitle: string;
  requestDate: string;
  status: 'รอการอนุมัติ' | 'อนุมัติ' | 'ปฏิเสธ';
}

// ฟังก์ชันสำหรับเรียกข้อมูลผู้เข้าร่วมกิจกรรมทั้งหมด
export const getActivitiesApi = async (): Promise<ParticipantsResponse> => {
  try {
    const data = localStorage.getItem('authData');
    const parsedData = data ? JSON.parse(data) : null;
    const token = parsedData?.token || '';
    
    const response = await api.get(`/api/activities/participants`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    console.log('getActivitiesApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching participants:', error);
    return { participants: [], total: 0, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };
  }
};

// ฟังก์ชันสำหรับเรียกข้อมูลการขออนุมัติเข้าร่วมกิจกรรม (เฉพาะที่มีสถานะ pending)
export const getPendingApprovals = async (): Promise<ApprovalRequest[]> => {
  try {
    const response = await getActivitiesApi();
    
    if (!response.participants || !Array.isArray(response.participants)) {
      console.error('Invalid participants data structure:', response);
      return [];
    }
    
    // แปลงข้อมูลผู้เข้าร่วมที่มีสถานะ 'pending' เป็นรูปแบบ ApprovalRequest
    const pendingRequests = response.participants
      .filter(participant => participant.registrationStatus === 'pending')
      .map(participant => {
        // แปลงวันที่ให้อยู่ในรูปแบบที่เหมาะสม
        const date = new Date(participant.registrationDate);
        const formattedDate = date.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        return {
          id: participant.registrationId,
          activityId: participant.activityId,
          userId: participant.userId,
          registrationId: participant.registrationId,
          studentName: participant.fullName,
          studentId: participant.studentId,
          eventId: participant.activityId,
          eventTitle: participant.activityName,
          requestDate: formattedDate,
          status: 'รอการอนุมัติ' as const
        };
      });
    
    console.log('Pending approval requests:', pendingRequests);
    return pendingRequests;
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    return [];
  }
};

// ฟังก์ชันสำหรับอัพเดทสถานะการอนุมัติ
export const updateApprovalStatus = async (
  activityId: string, 
  registrationId: string, 
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const data = localStorage.getItem('authData');
    const parsedData = data ? JSON.parse(data) : null;
    const token = parsedData?.token || '';

    const response = await api.put(
      `/api/activities/${activityId}/registrations/${registrationId}`,
      { status: status },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Update approval status response:', response.data);
    return true;
  } catch (error) {
    console.error('Error updating approval status:', error);
    return false;
  }
};