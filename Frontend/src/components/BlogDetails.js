import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { apiKey } from "../config/api.config";
import { ClipLoader } from "react-spinners";

function BlogDetails() {
  const [blogDetails, setBlogDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getDayWithSuffix = (day) => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };

    return `${getDayWithSuffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const blogId = localStorage.getItem("selectedBlogId");
        if (!blogId) {
          setLoading(false); // Set loading to false if no blogId is found
          return;
        }

        const response = await axios.post(`${apiKey}/blog/getBlog`, {
          _id: blogId,
        });
        setBlogDetails(response.data.data);
      } catch (error) {
        toast.error("server error");
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchBlogDetails();
  }, []);

  const processContent = (content) => {
    return content.replace(/\. /g, ".<br/>");
  };

  return (
    <div className="container">
      <br />
      {loading ? (
        <div className="loading-overlay">
          <ClipLoader size={50} color={"black"} loading={loading} />
        </div> // Display loading text while fetching data
      ) : blogDetails ? (
        <div
          className="card shadow p-lg-4 rounded-3 mb-4"
          key={blogDetails._id}
        >
          <img
            src={blogDetails.blogUrl}
            alt={blogDetails.title}
            className="card-img-top justify-content-center"
            style={{
              objectFit: "cover",
              height: "auto",
              width: "100%",
              maxHeight: "400px",
            }}
            // style={{  height: "350px" , width:"100%" }}
          />
          <br />
          <div className="m-lg-3 card-body">
            <h3
              className="d-lg-visible"
              style={{ fontWeight: "900", textDecoration: "underline" }}
            >
              {blogDetails.title}
            </h3>
            <br />
            <p className="text-muted" style={{ fontFamily: "fantasy" }} dangerouslySetInnerHTML={{ __html: processContent(blogDetails.content) }}></p>
            <br />
            <p className="card-text">
              Author:-
              <small className="text-muted text-decoration-underline">
                {blogDetails.author.toUpperCase()}
              </small>
            </p>
            <p className="card-text">
              Publication Date:-
              <small className="text-muted">
                {formatDate(blogDetails.Publication_date)}
              </small>
            </p>
          </div>
        </div>
      ) : (
        <p>No blog details found</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default BlogDetails;
