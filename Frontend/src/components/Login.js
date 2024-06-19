import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { apiKey } from "../config/api.config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.clear();
      const response = await axios.post(`${apiKey}/user/login`, {
        email,
        password,
      });

      setLoading(false);

      if (response.data.message === "Invalid credentials") {
        toast.error("Invalid credentials");
      } else {
        const { token, user_type, id, name } = response.data.data;

        // Store the token, user_type, and id in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user_type", user_type);
        localStorage.setItem("id", id);
        localStorage.setItem("name", name);

        // Configure Axios to include these values in headers for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios.defaults.headers.common["User-Type"] = user_type;
        axios.defaults.headers.common["User-Id"] = id;
        axios.defaults.headers.common["Name"] = name;

        toast.success("Login successful");

        // Redirect based on user_type
        if (user_type === 1) {
          setTimeout(() => (window.location.href = "/userProfiles"), 350);
        } else {
          setTimeout(() => {
            window.location.href = "/";
          }, 350);
        }
      }
    } catch (err) {
      setLoading(false);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <h2 className="h5 bg-dark text-light py-3 rounded-3 h2 text-center">
            Login into blogging World:-
          </h2>
          <br />
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
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                visibility="hidden"
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-lg"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="text-center">
          <p>
            {" "}
            Don't remember your password ? then{" "}
            <span>
              <NavLink to="/forgotPassword"> Forgot Password </NavLink>
            </span>
          </p>{" "}
          <button
            className="btn btn-outline-dark btn-md"
            type="submit"
            disabled={loading}
          >
            Login
          </button>
          <br /> <br />
          <p>
            Don't have an account then{"   "}
            <span>
              <NavLink to="/signup/user">Sign-up</NavLink>
            </span>
          </p>{" "}
          <br />
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Login;
