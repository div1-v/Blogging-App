import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import { apiKey } from "../config/api.config";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login for this functionality");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
  }, [navigate, token]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login for this functionality");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    if (typeof title !== "string" || title.length < 5 || title.length > 100) {
      toast.error("Title must be a string and between 5 and 100 characters.");
      return;
    }
    if (typeof content !== "string" || content.length < 300) {
      toast.error("Content must be a string and minimum of 300 characters.");
      return;
    }
    if (image) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(image.type)) {
        toast.error(
          "Invalid image format. Only JPEG, JPG, and PNG are allowed."
        );
        return;
      }
    } else {
      toast.error("Image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("upload_file", image);

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiKey}/blog/createBlog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response.data.message === "Token expired") {
        toast.error("Session Expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create blog.");
    }
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={60} color={"black"} loading={loading} />
        </div>
      )}
      <br />
      <form onSubmit={handleSubmit}>
        <div className="card shadow p-4 mt-lg-5 mb-4 ">
          <div className="text-center rounded-3 py-2 text-light bg-dark">
            <h1 className="h5">Create Blog</h1>
            <p className="small">
              Turn your{" "}
              <span className="bg-success text-white border-bottom border-dark">
                🅃🄷🄾🅄🄶🄷🅃🅂
              </span>{" "}
              into{" "}
              <span className="bg-primary text-white border-bottom border-dark">
                🄱🄻🄾🄶🅂
              </span>
            </p>
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              placeholder="Title"
              className="form-control"
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Content</label>
            <textarea
              value={content}
              placeholder="Content"
              className="form-control"
              rows="7"
              onChange={handleContentChange}
              required
            ></textarea>
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Image</label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              required
            />
          </div>
          <div className="text-center mt-2">
            <button className="btn btn-outline-dark btn-md" type="submit" disabled={loading}>
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
