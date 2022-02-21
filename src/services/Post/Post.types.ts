export interface Post {
  path: string;
  metadata: {
    title: string;
    date: string;
    image?: string;
  };
}
