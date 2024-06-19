import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import { apiKey } from "../config/api.config";

export default function ContactUs() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.length < 2 || name.length > 50) {
      toast.error("Name must be between 2 and 50 characters.");
      return;
    }
    if (title.length < 2 || title.length > 50) {
      toast.error("Title must be between 2 and 50 characters.");
      return;
    }
    if (email.length < 3 || email.length > 50) {
      toast.error("Email must be between 3 and 50 characters.");
      return;
    }
    if (message.length < 3 || message.length > 500) {
      toast.error("Message must be between 3 and 500 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiKey}/enquiry/createEnquiry`, {
        name,
        email,
        title,
        message,
      });

      setLoading(false);

      if (response.data.message === "Enquiry created successfully") {
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err)
      setLoading(false);
      toast.error("Enquiry failed. Please try again.");
    }
  };

  return (
    <div className="m-2 mt-5 bg-body bg-gradient rounded-3 shadow">
      {loading && (
        <div className="loading-overlay">
          <ClipLoader size={60} color={"black"} loading={loading} />
        </div>
      )}
      <div className="bg-dark text-center bg-gradient  text-white rounded-top">
        <h1 className="pt-3 my-2 h5" style={{ fontWeight: "1000" }}>
          CONTACT US
        </h1>
        <p className="mt-5 pb-5">
          Do you need website planning? Do you need website designing?<br />
          We can help your web design wishes come true. <br />
          First, enter your information on this form. We will communicate with you and<br />
          look forward to hearing your ideas.
        </p>
      </div>
      <br />
      <div className="rounded-3 pb-5 mb-5">
        <form onSubmit={handleSubmit} className="container rounded-3">
          <div className="d-lg-flex mt-3">
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="form-control border-start-0 p-3  rounded-0"
            />
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="form-control border-start-0 p-3 border-end-0 rounded-0"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="title"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="form-control border-start-0 p-3 border-end-0 rounded-0"
            />
            <textarea
              placeholder="Message"
              id="message"
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              className="form-control border-start-0 p-3 border-end-0 rounded-0"
              rows={3}
            ></textarea>
          </div>
          <div className="text-center">
            <button className="btn btn-outline-dark" type="submit" disabled={loading}>
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
