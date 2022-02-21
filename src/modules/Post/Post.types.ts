export interface Post {
  path: string;
  readingTime: string;
  metadata: {
    date: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
}
