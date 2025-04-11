
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-gearup-primary">404</h1>
        <p className="text-2xl font-semibold text-gearup-dark mt-4 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We can't seem to find the page you're looking for. Let's get you back on track.
        </p>
        <Link to="/">
          <Button className="bg-gearup-primary hover:bg-gearup-primary/90">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
