import { useQuery } from "@tanstack/react-query";
import {
  fetchActivities,
  fetchGalleryImages,
  fetchHomepageReviews,
  fetchStaff,
  fetchToppers,
  type ActivityRecord,
  type GalleryRecord,
  type ReviewRecord,
  type StaffRecord,
  type TopperRecord,
} from "@/services/content";

export const usePublishedActivities = () =>
  useQuery<ActivityRecord[]>({
    queryKey: ["public", "activities"],
    queryFn: () => fetchActivities(false),
  });

export const useActiveStaff = () =>
  useQuery<StaffRecord[]>({
    queryKey: ["public", "staff"],
    queryFn: () => fetchStaff(false),
  });

export const useActiveToppers = () =>
  useQuery<TopperRecord[]>({
    queryKey: ["public", "toppers"],
    queryFn: () => fetchToppers(false),
  });

export const useFeaturedReviews = () =>
  useQuery<ReviewRecord[]>({
    queryKey: ["public", "reviews"],
    queryFn: () => fetchHomepageReviews(false),
  });

export const usePublishedGallery = () =>
  useQuery<GalleryRecord[]>({
    queryKey: ["public", "gallery"],
    queryFn: () => fetchGalleryImages(false),
  });

