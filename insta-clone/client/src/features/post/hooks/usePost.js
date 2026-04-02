import {
  createPost,
  getFeed,
  likePost,
  unlikePost,
} from "../services/post.api";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, post, feed, setLoading, setPost, setFeed } = context;

  const handleGetFeed = async () => {
    try {
      setLoading(true);
      const result = await getFeed();
      if (result.success) {
        setFeed(result.posts);
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (imageFile, caption) => {
    try {
      setLoading(true);
      const result = await createPost(imageFile, caption);
      if (result.success) {
        setFeed([result.post, ...feed]);
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const result = await likePost(postId);
      if (result.success) {
        await handleGetFeed();
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleUnLikePost = async (postId) => {
    try {
      const result = await unlikePost(postId);
      if (result.success) {
        await handleGetFeed();
        return result;
      } else {
        return result.error;
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    handleGetFeed();
  }, []);

  return {
    loading,
    feed,
    post,
    handleGetFeed,
    handleCreatePost,
    handleLikePost,
    handleUnLikePost,
  };
};
