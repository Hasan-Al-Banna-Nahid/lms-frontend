export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  order: number;
  isPreview: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  isPaid: boolean;
  status: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  lessons: Lesson[];
}
