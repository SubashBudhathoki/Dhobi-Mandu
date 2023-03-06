import React from "react";

export default function ContactInfoComponent() {
  return (
    <div className="container-fluid contact-info mt-5 mb-4">
      <div className="container" style={{ padding: "0 30px" }}>
        <div className="row">
          <div
            className="col-md-4 d-flex align-items-center justify-content-center bg-secondary mb-4 mb-lg-0"
            style={{ height: "100px" }}
          >
            <div className="d-inline-flex">
              <i className="fa fa-2x fa-map-marker-alt text-white m-0 mr-3"></i>
              <div className="d-flex flex-column">
                <h5 className="text-white font-weight-medium">Our Location</h5>
                <p className="m-0 text-white">Nayabazar-16, Kathmandu, Nepal</p>
              </div>
            </div>
          </div>
          <div
            className="col-md-4 d-flex align-items-center justify-content-center bg-primary mb-4 mb-lg-0"
            style={{ height: "100px" }}
          >
            <div className="d-inline-flex text-left">
              <i className="fa fa-2x fa-envelope text-white m-0 mr-3"></i>
              <div className="d-flex flex-column">
                <h5 className="text-white font-weight-medium">Email Us</h5>
                <p className="m-0 text-white">Dhobimandu@gmail.com</p>
              </div>
            </div>
          </div>
          <div
            className="col-md-4 d-flex align-items-center justify-content-center bg-secondary mb-4 mb-lg-0"
            style={{ height: "100px" }}
          >
            <div className="d-inline-flex text-left">
              <i className="fa fa-2x fa-phone-alt text-white m-0 mr-3"></i>
              <div className="d-flex flex-column">
                <h5 className="text-white font-weight-medium">Call Us</h5>
                <p className="m-0 text-white">+9779812345678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
