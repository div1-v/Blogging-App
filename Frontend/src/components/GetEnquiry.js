import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiKey } from "../config/api.config";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

export default function GetEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
      return; // Exit the function if the user cancels the deletion
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${apiKey}/enquiry/deleteEnquiry`, {
        data: { _id: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = "/userEnquiries";
      localStorage.setItem("enquiryDeleted", "true");
      return;
    } catch (error) {
      toast.error("Error deleting enquiry");
    }
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login for this functionality");
          setTimeout(() => {
            navigate("/login");
          }, 1000); // 1-second delay
          setLoading(false);
          return;
        }
        // Fetch enquiries with authentication token
        const response = await axios.get(`${apiKey}/enquiry/getEnquiry`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.message === "Invalid token") {
          toast.error("Please Login Again");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
        if (response.data.message === "Token expired") {
          toast.error("Session expired. Please login again.");
          setTimeout(() => {
            navigate("/login");
          }, 1200);
          return;
        }
        const deletedEnquiry = localStorage.getItem("enquiryDeleted");
        if (deletedEnquiry) {
          toast.success("Enquiry deleted successfully");
          localStorage.removeItem("enquiryDeleted");
        }
        setEnquiries(response.data.data); // Set enquiries state
      } catch (error) {
        toast.error("Error fetching enquiries:");
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };
    fetchEnquiries();
  }, [navigate]);

  return (
    <>
    <h3 className="text-center">User Enquiries</h3>
      <div style={{ overflowX: "auto", height: "380px", margin: "20px" }}>
        {loading ? (
          <div className="loading-overlay">
            <ClipLoader size={50} color={"black"} loading={loading} />
          </div> // Display loading text while fetching data
        ) : enquiries && enquiries.length > 0 ? (
          <>
            <table className="p-2 text-center table table-hover">
              <thead>
                <tr>
                  <th>Sr.NO.</th>
                  {/* <th>ID</th> */}
                  <th>FullName</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry, index) => (
                  <tr key={enquiry._id}>
                    <td>{index + 1}</td>
                    {/* <td>{enquiry._id}</td> */}
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.title}</td>
                    <td>{enquiry.message}</td>
                    <td>
                      <button
                        onClick={() => deleteEnquiry(enquiry._id)}
                        className="btn btn-outline-dark"
                      >
                        Delete Enquiry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No enquiries found</p>
        )}
        <ToastContainer />
      </div>
    </>
  );
}
