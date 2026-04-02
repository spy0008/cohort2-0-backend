import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function getFeed() {
  try {
    const response = await api.get("/api/post/feed");

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Get Feed failed. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}

export async function createPost(imageFile, caption) {
  try {
    const formData = new FormData();

    formData.append("imgUrl", imageFile);
    formData.append("caption", caption);

    const response = await api.post("/api/post/create", formData);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "failed to create a post. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}

export async function likePost(postId) {
  try {
    const response = await api.post(`/api/post/like/${postId}`);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "failed to like post. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}

export async function unlikePost(postId) {
  try {
    const response = await api.post(`/api/post/unlike/${postId}`);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "failed to unlike post. Please try again.";
    return { success: false, error: message, status: error.response?.status };
  }
}
