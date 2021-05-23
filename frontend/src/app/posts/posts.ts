export class Comment {
  body: string;
  email: string;
  id: number;
  name: string;
  postId: number;
}

export default class Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  comments: Comment[];
}
