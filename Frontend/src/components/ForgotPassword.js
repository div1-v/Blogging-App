import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { apiKey } from "../config/api.config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiKey}/user/forgotPassword`, {
        email,
      });

      setLoading(false);

      if (response.data.message === "User not found") {
        toast.error(response.data.message);
        return;
      }

      localStorage.setItem("resettoken", response.data.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/resetPassword");
      }, 1000);
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  return (
    <div className="container">
      <br />
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={60} color={"black"} loading={loading} />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="card shadow p-4 mt-lg-5 mb-4">
          <h2 className="h5 bg-dark text-light rounded-3 py-3 text-center">
            Forgot Password
          </h2>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="text-center">
          <button
            className="btn btn-outline-dark btn-md"
            type="submit"
            style={{ padding: "0.5em 1em" }}
            disabled={loading}
          >
            Proceed
          </button>
        </div>
        <br />
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
