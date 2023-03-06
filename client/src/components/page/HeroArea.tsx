import ALink from "../common/ALink";

export default function HeroArea() {
  return (
    <div className="container-fluid p-0">
      <div id="header-carousel" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="w-100" src="/img/hero.webp" alt="Image" />
            <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div className="p-3" style={{ maxWidth: "900px" }}>
                <h4 className="text-white text-uppercase mb-md-3">
                  Laundry & Dry Cleaning
                </h4>
                <h1 className="display-3 text-white mb-md-4">
                  Best For Laundry Services
                </h1>
                <ALink
                  href="/about"
                  className="btn btn-primary py-md-3 px-md-5 mt-2"
                >
                  Learn More
                </ALink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
