import React from "react";
import ALink from "../components/common/ALink";

export default function Footer() {
  return (
    <footer>
      <div className="container-fluid bg-primary text-white mt-5 pt-5 px-sm-3 px-md-5">
        <div className="row pt-5">
          <div className="col-lg-3 col-md-6 mb-5">
            <ALink href="/">
              <h1 className="text-secondary mb-3">
                <span className="text-white">Dhobi-Mandu</span>
              </h1>
            </ALink>
            <p>
            DHOBI-MANDU is required to provide the 
promised services, and client satisfaction is ensured. Online on-demand laundry business 
DHOBI-MANDU, established in Kathmandu, strives to offer high-quality laundry services.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-5">
            <h4 className="text-white mb-4">Get In Touch</h4>
            <p>
            "We Would Love To Hear From You."
            </p>
            <p>
              <i className="fa fa-map-marker-alt mr-2"></i>Nayabazar, Kathmandu,
              Nepal           
            </p>
            <p>
              <i className="fa fa-phone-alt mr-2"></i>+9779812345678
            </p>
            <p>
              <i className="fa fa-envelope mr-2"></i>Dhobimandu@gmail.com
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
              {/* <a className="text-white mb-2" href="#">
                <i className="fa fa-angle-right mr-2"></i>Pricing
              </a> */}
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
