import Post from "../../components/utils/Post";
import { apiInstance } from "../../api/instance";
import { authStore } from "../../stores/auth-store";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const token = authStore((state) => state.token);
  const [posts, setPosts] = useState([]);

  async function loadPost() {
    const response = await apiInstance.get("/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    setPosts(response.data);
  }

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <div className="feed-page">
      {posts.length > 0 ? (
        <section className="feed">
          {posts.map((post) => (
            <Post {...post} />
          ))}
        </section>
      ) : (
        <section className="no-posts">
          <p>Your friends haven't posted anything yet. Check back later.</p>
        </section>
      )}
    </div>
  );
}
