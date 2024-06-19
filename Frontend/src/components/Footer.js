import React from 'react';
export default function Footer() {
  return (
    <div className="d-flex flex-column" style={{minHeight:"50vh"}}>
      {/* Other page content goes here */}

      <footer className="footer mt-auto bg-dark text-white">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 style={{ fontWeight: '800' }}>Blogging World</h5>
              <p>
                Welcome to Blogging World, your number one source for all things blog-related. We’re dedicated to providing you the best of blogging tips, with a focus on quality, reliability, and uniqueness.
              </p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 style={{ fontWeight: '800' }}>Categories</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white text-start">Tech</a></li>
                <li><a href="#" className="text-white">Lifestyle</a></li>
                <li><a href="#" className="text-white">Travel</a></li>
                <li><a href="#" className="text-white">Food</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 style={{ fontWeight: '800' }}>Follow Us</h5>
              <ul className="list-unstyled d-flex">
                <li><a href="#" className="text-white me-3"><i className="bi bi-facebook"></i> Facebook</a></li>
                <li><a href="#" className="text-white me-3"><i className="bi bi-twitter"></i> Twitter</a></li>
                <li><a href="#" className="text-white"><i className="bi bi-instagram"></i> Instagram</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-white text-dark text-center py-3">
          <p className="mb-0" style={{fontWeight:"1000"}}>&copy; 2024 Blogging World. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
