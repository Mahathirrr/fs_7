"use client";

import { create } from 'zustand';
import { Course } from '@prisma/client';

interface CourseStore {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: Partial<Course>) => Promise<Course>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<Course>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      set({ courses: data, error: null });
    } catch (error) {
      set({ error: 'Failed to fetch courses' });
    } finally {
      set({ isLoading: false });
    }
  },

  createCourse: async (courseData) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      const course = await response.json();
      set((state) => ({ courses: [...state.courses, course], error: null }));
      return course;
    } catch (error) {
      set({ error: 'Failed to create course' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCourse: async (courseId, courseData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      const updatedCourse = await response.json();
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId ? updatedCourse : course
        ),
        error: null,
      }));
      return updatedCourse;
    } catch (error) {
      set({ error: 'Failed to update course' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));