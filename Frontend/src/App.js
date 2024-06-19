// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/UserSignup";
import HomePage from "./components/HomePage";
import AdminSignup from "./components/AdminSignup";
import UserProfiles from "./components/UserProfiles";
import UserProfile from "./components/UserProfile";
import Navbar from "./components/Navbar";
import UpdateProfile from "./components/UpdateProfile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import CreateBlog from "./components/CreateBlog";
import BlogList from "./components/MyBlogs";
import BlogDetails from "./components/BlogDetails";
import ChangePassword from "./components/ChangePassword";
import UpdateBlog from "./components/UpdateBlog";
import AllBlogs from "./components/AllBlogs";
import GetEnquiry from "./components/GetEnquiry";
import Footer from "./components/Footer";

const App = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    // const user_type = localStorage.getItem("user_type");
    const name = localStorage.getItem("name");
    setUserName(name);
  }, []);

  return (
    <BrowserRouter>
      <Navbar name={userName} /> <br></br> <br></br>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allBlogs" element={<AllBlogs />} />
        <Route path="/userProfiles" element={<UserProfiles />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/user" element={<Signup />} />
        <Route path="/signup/admin" element={<AdminSignup />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/createBlog" element={<CreateBlog />} />
        <Route path="/myBlogs" element={<BlogList />} />
        <Route path="/getBlog" element={<BlogDetails />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/updateBlog" element={<UpdateBlog />} />
        <Route path="/userEnquiries" element={<GetEnquiry />} />
        <Route path="*" element={<h1>Error..., Page Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
