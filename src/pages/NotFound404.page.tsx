

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
      <h1 className="text-7xl font-bold mb-6 text-error">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-base-content">
        Oops! Page not found.
      </h2>
      <p className="text-center text-base-content/70 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="btn btn-primary"
      >
        ← Go Back Home
      </a>
    </div>
  );
}

export default NotFoundPage;