import api from './api';

export interface Major {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
  majors: Major[];
}

// ดึงข้อมูล faculties และ majors แยกออกมาเป็น 2 array
export const getFacultiesAndMajorsApi = async (): Promise<{faculties:Faculty[]}> => {
  const response = await api.get('/faculties/');
  console.log('getFacultiesAndMajorsApi response.data:', response.data);
  return response.data

};
