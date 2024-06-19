import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiKey } from "../config/api.config";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,20}$/;
    return passwordRegex.test(password);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    if (!validatePassword(password)) {
      toast.error(
        "Password must be 8-20 characters long, include at least one special character, and one uppercase character."
      );
      return;
    }
    try {
      const response = await axios.post(`${apiKey}/user/signup/user`, {
        first_name: firstName,
        last_name: lastName,
        user_name: userName,
        bio,
        email,
        password,
      });
      setLoading(false);

      if (response.data.message === "Email already exists") {
        toast.error("User already exists. Please try again.");
      } else {
        toast.success(
          // "Profile created successfully. Redirecting to Home page."
          response.data.message
        );
        setTimeout(() => {
          navigate("/login"); // Redirect to home page
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Signup failed. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={60} color={"black"} loading={loading} />
        </div>
      )}
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="card shadow p-4 mt-lg-5 mb-4">
          <h2 className="bg-dark text-light py-3 rounded-3 text-center h5">
            {" "}
            Create a blogging profile :-
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
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-control"
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
            <label className="form-label">Bio/About Yourself (optional):</label>
            <textarea
              className="form-control"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              rows="3"
            ></textarea>
          </div>
        </div>
        <br></br>
        <div className="text-center">
          <button className="btn btn-outline-dark btn-md" type="submit">
            Signup
          </button>
          <br></br> <br></br>
          <p>
            Already have an account then{"  "}
            <span>
              <NavLink to="/login">Login</NavLink>
            </span>{" "}
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
