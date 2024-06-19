import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiKey } from "../config/api.config";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

function UserProfile() {
  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (!confirmed) {
      return; // Exit the function if the user cancels the deletion
    }

    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${apiKey}/user/deleteProfile`, {
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === "Profile deleted successfully") {
        toast.success("Profile deleted successfully");
        setTimeout(() => {
          localStorage.removeItem("id");
          localStorage.removeItem("token");
          window.location.href = "/signup/user";
        }, 1000); // 1-second delay
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login for this functionality");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        setLoading(false); // 1-second delay
        return;
      }
      try {
        // Define the API endpoint
        const apiUrl = `${apiKey}/user/getProfile`;

        // Make a POST request to the API with ID in the request body
        const response = await axios.post(
          apiUrl,
          { id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check response status
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        // Parse response data
        const data = response.data;
        if (data.message === "Invalid token") {
          toast.error("Please Login Again");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        if (data.message === "Token expired") {
          // localStorage.removeItem("token");
          // localStorage.removeItem("user_type");
          // localStorage.removeItem("id");
          toast.error("Session expired. Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 1200);
        }
        // Set the user data state
        setUserData(data.data);
      } catch (error) {
        // Handle errors
        toast.error("There was a problem with the fetch operation:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    // Call the fetchUserProfile function
    fetchUserProfile();
  }, []); // Empty dependency array ensures this effect runs only once after the component mounts

  return (
    <div>
      {userData ? (
        <div className="container">
          <div className="card shadow p-5 mb-4">
            <h1 className="h4 py-3 rounded-3 bg-dark text-center text-light">
              {userData.user_type === 1 ? "Admin Profile" : "User Profile"}
            </h1>{" "}
            <br></br> <br></br>
            <p className="h4">ID: {userData._id}</p> <br></br>
            <p className="h4">FirstName: {userData.first_name}</p> <br></br>
            <p className="h4">LastName: {userData.last_name}</p> <br></br>
            <p className="h4">UserName: {userData.user_name}</p> <br></br>
            <p className="h4">Email: {userData.email}</p> <br></br>
            <p className="h4">
              Bio: {userData.bio === "" ? "User has no bio" : userData.bio}
            </p>{" "}
            <br></br>
            <p className="h4">
              User_type: {userData.user_type === 1 ? "Admin" : "User"}
            </p>
            <br></br>
            <div className="text-center">
              <Link
                to="/updateProfile"
                className="btn btn-outline-dark btn-md"
                type="submit"
              >
                Update-Profile
              </Link>{" "}
              {"   "}
              <button
                className="btn btn-outline-dark btn-md"
                type="submit"
                onClick={handleDeleteProfile}
              >
                Delete-Profile
              </button>
              {"   "}
              <Link
                to="/changePassword"
                className="btn btn-outline-dark btn-md"
                type="submit"
              >
                Change-Password
              </Link>{" "}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-overlay">
          <ClipLoader size={50} color={"black"} loading={loading} />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserProfile;
