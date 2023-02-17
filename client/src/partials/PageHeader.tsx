export default function Header({ title }: { title: string }) {
  return (
    <header className="page-header container-fluid bg-secondary pt-2 pt-lg-5 pb-2 mb-5">
      <div className="container py-5">
        <div className="row align-items-center py-4">
          <div className="col-md-6 text-center text-md-left">
            <h1 className="mb-4 mb-md-0 text-white">{title}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
