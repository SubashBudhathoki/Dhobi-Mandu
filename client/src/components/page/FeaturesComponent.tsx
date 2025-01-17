export default function FeaturesComponent() {
  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 m-0 my-lg-5 pt-0 pt-lg-5 pr-lg-5">
            <h6 className="text-secondary text-uppercase font-weight-medium mb-3">
              Our Features
            </h6>
            <h1 className="mb-4">Why Choose Us</h1>
            <p>
            We are providing continues laundry services for the last two years. We are also able to provide affordable pricing and quick delivery with our expert cleaner. We are also ensuring the quality guaranteed services without any compromises.
            </p>
            <div className="row">
              <div className="col-sm-6 mb-4">
                <h1 className="text-secondary" data-toggle="counter-up">
                  1
                </h1>
                <h5 className="font-weight-bold">Years Expereince</h5>
              </div>
              <div className="col-sm-6 mb-4">
                <h1 className="text-secondary" data-toggle="counter-up">
                  10
                </h1>
                <h5 className="font-weight-bold">Expert Worker</h5>
              </div>
              <div className="col-sm-6 mb-4">
                <h1 className="text-secondary" data-toggle="counter-up">
                  100
                </h1>
                <h5 className="font-weight-bold">Happy Clients</h5>
              </div>
              <div className="col-sm-6 mb-4">
                <h1 className="text-secondary" data-toggle="counter-up">
                  500
                </h1>
                <h5 className="font-weight-bold">Dry Cleaning</h5>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="d-flex flex-column align-items-center justify-content-center bg-secondary h-100 py-5 px-3">
              <i className="fa fa-5x fa-certificate text-white mb-5"></i>
              <h1 className="display-1 text-white mb-3">1+</h1>
              <h1 className="text-white m-0">Years Experience</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
