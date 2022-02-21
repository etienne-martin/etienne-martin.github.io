export interface Post {
  path: string;
  readingTime: string;
  metadata: {
    date: string;
    title: string;
    description: string;
    image: {
      src: string;
      srcSet: string;
      width: number;
      height: number;
    };
    imageAlt: string;
  };
}
