import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import errorImg from "/images/404error.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <img src={errorImg} alt="404 Page not found" className="errorImageClass" />
        
        <a href="/" className="text-primary hover:text-primary/90">Return to Home</a>
        {/* <button href="/" className="">Return to Home</button> */}
        {/* <Button 
            variant="ghost" 
            className="absolute left-4 top-4"
            
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button> */}
      </div>
    </div>
  );
};

export default NotFound;
