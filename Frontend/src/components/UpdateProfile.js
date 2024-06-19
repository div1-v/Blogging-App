import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiKey } from "../config/api.config";
import { ClipLoader } from "react-spinners";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    user_name: "",
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login for this functionality");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      const response = await axios.post(
        `${apiKey}/user/getProfile`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Token expired") {
        toast.error("Token expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      const profileData = response.data.data; // Assuming the API response contains user profile data
      setFormData(profileData);
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setLoading(false); // Set loading to false after fetch is complete
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.first_name.length < 3 || formData.first_name.length > 20) {
      toast.error("First Name must be between 3 and 20 characters.");
      return;
    }
    if (formData.last_name.length < 3 || formData.last_name.length > 20) {
      toast.error("Last Name must be between 3 and 20 characters.");
      return;
    }
    if (formData.user_name.length < 3 || formData.user_name.length > 20) {
      toast.error("User Name must be between 3 and 20 characters.");
      return;
    }
    if (formData.email.length < 3 || formData.email > 50) {
      toast.error("Email must be between 3 and 50 characters.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login for this functionality");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      const response = await axios.patch(
        `${apiKey}/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Token expired") {
        toast.error("Token expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }

      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/userProfile");
      }, 800);
    } catch (error) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="container">
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="card shadow p-4 mt-lg-5 mb-4">
          <h2 className="bg-dark text-light py-3 rounded-3 text-center h5">
            Update Profile
          </h2>
          {loading ? (
            <div className="loading-overlay">
              <ClipLoader size={50} color={"black"} loading={loading} />
            </div> // Display loading text while fetching data
          ) : (
            <>
              <div className="mb-3 mt-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 mt-3">
                <label className="form-label">Bio:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="bio"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
        </div>
        <div className="text-center mb-5">
          <button className="btn btn-outline-dark btn-md" type="submit">
            Update Profile
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;
