import React from "react";

export default function AboutUs() {
  return (
    <div className="m-2 bg-body rounded-3 shadow">
      <h1 className="h5 my-5 text-center bg-dark text-white py-2 bg-gradient rounded-top" style={{fontWeight:"1000"}}>
        ABOUT US
        {/* 🄰🄱🄾🅄🅃 🅄🅂 */}
      </h1>
      <p
        className="mt-5 pb-5 text-center container h-auto"
        style={{ height: "200px" }}
      >
        We love Web Design & Technology.<br></br> We are a small team, but we
        possess a highly skilled work force. <br></br>Our goal is to produce
        great work with positive energy. <br></br>Let’s enjoy creating together.
      </p>
    </div>
  );
}
