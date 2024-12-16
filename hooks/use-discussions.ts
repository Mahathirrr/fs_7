"use client";

import useSWR from "swr";
import { Discussion } from "@/types/discussion";

interface UseDiscussionsOptions {
  lessonId?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDiscussions(courseId: string, options: UseDiscussionsOptions = {}) {
  const { lessonId, searchQuery, page = 1, limit = 10 } = options;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(lessonId && { lessonId }),
    ...(searchQuery && { q: searchQuery }),
  });

  const { data, error, mutate } = useSWR<{
    data: Discussion[];
    total: number;
    pages: number;
  }>(`/api/courses/${courseId}/discussions?${queryParams}`, fetcher);

  return {
    discussions: data?.data,
    total: data?.total,
    pages: data?.pages,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}