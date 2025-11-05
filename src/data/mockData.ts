export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  image: string;
}

export interface Topper {
  id: string;
  name: string;
  class: string;
  percentage: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Solo Song Competition (Folk Song)",
    description: "Classes VI-VIII participated in a wonderful folk song competition showcasing traditional music.",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Annual Sports Day",
    description: "Students displayed remarkable athletic abilities in various sports events.",
    date: "2024-03-10",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Science Exhibition",
    description: "Young scientists showcased innovative projects and experiments.",
    date: "2024-03-05",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop"
  }
];

export const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    designation: "Principal",
    qualification: "Ph.D. in Education",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    name: "Mrs. Priya Sharma",
    designation: "Vice Principal",
    qualification: "M.Ed., M.A. English",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    name: "Mr. Amit Verma",
    designation: "Mathematics HOD",
    qualification: "M.Sc. Mathematics",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  }
];

export const mockToppers: Topper[] = [
  {
    id: "1",
    name: "Ananya Singh",
    class: "Class XII",
    percentage: "98.5%",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    name: "Rohan Patel",
    class: "Class X",
    percentage: "97.2%",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    name: "Sneha Reddy",
    class: "Class XII",
    percentage: "96.8%",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
  }
];

export const mockGallery: GalleryImage[] = [
  {
    id: "1",
    title: "Annual Function",
    category: "Events",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Science Lab",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Sports Complex",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Cultural Program",
    category: "Events",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "Library",
    category: "Facilities",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop"
  },
  {
    id: "6",
    title: "Art Exhibition",
    category: "Events",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
  }
];
