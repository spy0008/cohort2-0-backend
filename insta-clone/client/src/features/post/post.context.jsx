import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState(null);
  const [post, setPost] = useState(null);

  return (
    <PostContext.Provider
      value={{ loading, post, feed, setLoading, setPost, setFeed }}
    >
      {children}
    </PostContext.Provider>
  );
};
