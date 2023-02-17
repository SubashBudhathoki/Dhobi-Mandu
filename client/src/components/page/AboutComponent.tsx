export default function AboutComponent() {
  return (
    <div className="container-fluid py-5">
      <div className="container pt-0 pt-lg-4">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <img className="img-fluid" src="/img/about.jpg" alt="" />
          </div>
          <div className="col-lg-7 mt-5 mt-lg-0 pl-lg-5">
            <h6 className="text-secondary text-uppercase font-weight-medium mb-3">
              Learn About Us
            </h6>
            <h1 className="mb-4">
              We Are Quality Laundry Provider In Your City
            </h1>
            <h5 className="font-weight-medium font-italic mb-4">
              Clita sit et ipsum sed. Volup duo sea dolor rebum ea rebum kasd
              stet. Dolor at duo dolor sit stet.
            </h5>
            <p className="mb-2">
              Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo
              dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo.
              Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est
              dolor
            </p>
            <div className="row">
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  <i className="fa fa-check text-primary mr-2"></i>
                  <p className="text-secondary font-weight-medium m-0">
                    Quality Laundry Service
                  </p>
                </div>
              </div>
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  <i className="fa fa-check text-primary mr-2"></i>
                  <p className="text-secondary font-weight-medium m-0">
                    Express Fast Delivery
                  </p>
                </div>
              </div>
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  <i className="fa fa-check text-primary mr-2"></i>
                  <p className="text-secondary font-weight-medium m-0">
                    Highly Professional Staff
                  </p>
                </div>
              </div>
              <div className="col-sm-6 pt-3">
                <div className="d-flex align-items-center">
                  <i className="fa fa-check text-primary mr-2"></i>
                  <p className="text-secondary font-weight-medium m-0">
                    100% Satisfaction Gguarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
