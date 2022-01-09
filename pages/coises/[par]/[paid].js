import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const ff = router.query;
  console.log(ff);
  return <p>Post:</p>;
};
Post.auth = true;

export default Post;
