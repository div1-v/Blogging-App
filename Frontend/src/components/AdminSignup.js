import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { apiKey } from "../config/api.config";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (firstName.length < 2 || firstName.length > 20) {
      toast.error("First Name must be between 2 and 20 characters.");
      return;
    }
    if (lastName.length < 2 || lastName.length > 20) {
      toast.error("Last Name must be between 2 and 20 characters.");
      return;
    }
    if (userName.length < 3 || userName.length > 20) {
      toast.error("User Name must be between 3 and 20 characters.");
      return;
    }
    if (email.length < 3 || email.length > 50) {
      toast.error("Email must be between 3 and 50 characters.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${apiKey}/user/signup/admin`, {
        first_name: firstName,
        last_name: lastName,
        user_name: userName,
        email,
      });

      setLoading(false);

      if (response.data.message === "Email already exists") {
        toast.error(response.data.message);
      } else {
        toast.success("Admin Profile Created Successfully");
        setTimeout(() => {
          navigate("/userProfiles");
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Signup failed. Please try again.");
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
        <div className="card shadow p-4 mt-lg-5 mb-4">
          <h2 className="h5 bg-dark text-light py-3 text-center rounded-3">
            Create an Admin profile:
          </h2>
          <div className="mb-3 mt-3">
            <label className="form-label">FirstName:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="FirstName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">LastName:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="LastName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">UserName:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="UserName"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="mt-2 text-center">
          <button className="btn btn-outline-dark btn-md" type="submit" disabled={loading}>
            Submit
          </button>
        </div>
        <br />
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
