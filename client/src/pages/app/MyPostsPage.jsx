import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import MyPost from "../../components/utils/MyPost";
import { apiInstance } from "../../api/instance";
import { authStore } from "../../stores/auth-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@chakra-ui/react";

export default function MyPostsPage() {
  const token = authStore((state) => state.token);

  /**
   * @type {{caption: string;image: string, fullName: string, createdAt: string, likes: number}[]}
   */
  let [posts, setPosts] = useState([]);

  async function loadMyPosts() {
    console.log("Loading posts...");
    const response = await apiInstance.get("/posts/my-posts/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    posts = response.data;
    setPosts(posts);
  }

  useEffect(() => {
    loadMyPosts();
  }, []);

  return (
    <div className="feed-page">
      {posts.length > 0 ? (
        <section className="feed">
          {posts.map((post) => (
            <MyPost {...post} key={post._id} />
          ))}
        </section>
      ) : (
        <section className="no-posts">
          <p>
            You haven't posted anything yet. Click on the <b>+</b> icon to post
            something.
          </p>
          <Link as={RouterLink} to="/app/new-post">
            <FontAwesomeIcon icon="square-plus" />
          </Link>
        </section>
      )}
    </div>
  );
}
