import Post from "../components/Post";
import "../styles/feed.scss";
import { usePost } from "../hooks/usePost";
import { useEffect } from "react";
import Navbar from "../../shared/components/Navbar";

const Feed = () => {
  const { feed, handleGetFeed, loading, handleLikePost, handleUnLikePost } =
    usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading || !feed) {
    return (
      <main>
        <h1>Feed is loading... </h1>
      </main>
    );
  }
  return (
    <main className="feed-page">
      <Navbar />
      <div className="feed">
        <div className="posts">
          {feed.map((post, idx) => (
            <Post
              key={idx}
              user={post.user}
              post={post}
              handleLikePost={handleLikePost}
              handleUnLikePost={handleUnLikePost}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
