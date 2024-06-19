import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { apiKey } from "../config/api.config";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiKey}/user/changePassword`,
        {
          oldPassword,
          password,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (!token) {
        toast.error("Please login for this functionality");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        return;
      }
      if (response.data.message === "Token expired") {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
        return;
      }
      if (response.data.message === "Invalid old password") {
        toast.error(response.data.message);
        return;
      }
      if (!validatePassword(password)) {
        toast.error(
          "Password must be 8-20 characters long, include at least one special character, and one uppercase character."
        );
        return;
      }
      if (response.data.message === "Password not matched") {
        toast.error(response.data.message);
        return;
      }
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/userProfile");
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Server Error");
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container mt-5">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={60} color={"black"} loading={loading} />
        </div>
      )}
      <form onSubmit={handleChangePassword}>
        <div className="card shadow p-4 mt-lg-5 mb-4">
          <h2 className="h5 bg-dark text-light py-3 text-center rounded-3">
            Change Password
          </h2>
          <br></br>
          <div className="mb-3">
            <label className="form-label">Old Password:</label>
            <div className="input-group">
              <input
                className="form-control"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={toggleOldPasswordVisibility}
                >
                  {showOldPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">New Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password:</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                className="form-control"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-outline-dark btn-md" type="submit" disabled={loading}>
            Change Password
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
