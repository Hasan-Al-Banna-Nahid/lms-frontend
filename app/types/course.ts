export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  isPaid: boolean;
  status: string;
  category: {
    name: string;
  };
  instructor: {
    firstName: string;
    lastName: string;
  };
}
