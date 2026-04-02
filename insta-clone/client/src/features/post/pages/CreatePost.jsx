import { useNavigate } from "react-router-dom";
import "../../auth/styles/form.scss";
import { usePost } from "../hooks/usePost";
import "../styles/createpost.scss";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const postImageInputRef = useRef(null);
  const { handleCreatePost, loading } = usePost();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const file = postImageInputRef.current.files[0];

    const result = await handleCreatePost(file, caption);

    if (result.success) {
      toast.success(result?.message || "post created Successfully!!!");
      navigate("/");
    } else {
      toast.error(result || "post create Failed");
    }

    setCaption("");
    postImageInputRef.current.files = null;
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create post</h1>
        <form onSubmit={handleSubmit}>
          <label className="post-image-label" htmlFor="postImage">
            Select image{" "}
          </label>
          <input
            ref={postImageInputRef}
            hidden
            type="file"
            name="postImage"
            id="postImage"
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            type="text"
            name="caption"
            id="caption"
          />
          <button className="button">
            {loading ? "creating post..." : "create post"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
