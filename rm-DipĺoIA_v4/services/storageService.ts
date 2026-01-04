
import { Course } from '../types';

const STORAGE_KEY = 'diploia_studio_data';

export const storageService = {
  saveCourses: (courses: Course[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  },
  loadCourses: (): Course[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};
