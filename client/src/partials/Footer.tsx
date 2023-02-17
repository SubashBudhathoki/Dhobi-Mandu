import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="container-fluid bg-primary text-white mt-5 pt-5 px-sm-3 px-md-5">
        <div className="row pt-5">
          <div className="col-lg-3 col-md-6 mb-5">
            <a href="">
              <h1 className="text-secondary mb-3">
                <span className="text-white">DRY</span>ME
              </h1>
            </a>
            <p>
              Volup amet magna clita tempor. Tempor sea eos vero ipsum. Lorem
              lorem sit sed elitr sit no, sed kasd et ipsum dolor duo dolor
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-5">
            <h4 className="text-white mb-4">Get In Touch</h4>
            <p>
              Dolor clita stet nonumy clita diam vero, et et ipsum diam labore
            </p>
            <p>
              <i className="fa fa-map-marker-alt mr-2"></i>123 Street, New York,
              USA
            </p>
            <p>
              <i className="fa fa-phone-alt mr-2"></i>+012 345 67890
            </p>
            <p>
              <i className="fa fa-envelope mr-2"></i>info@example.com
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-5">
            <h4 className="text-white mb-4">Quick Links</h4>
            <div className="d-flex flex-column justify-content-start">
              <a className="text-white mb-2" href="#">
                <i className="fa fa-angle-right mr-2"></i>Home
              </a>
              <a className="text-white mb-2" href="#">
                <i className="fa fa-angle-right mr-2"></i>About Us
              </a>
              <a className="text-white mb-2" href="#">
                <i className="fa fa-angle-right mr-2"></i>Services
              </a>
              <a className="text-white mb-2" href="#">
                <i className="fa fa-angle-right mr-2"></i>Pricing
              </a>
              <a className="text-white" href="#">
                <i className="fa fa-angle-right mr-2"></i>Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
