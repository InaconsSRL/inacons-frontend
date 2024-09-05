import React from "react";
import "../components/Loader.css";

const Loader: React.FC = () => {
  return (
    <>
      <div className="loader">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
    </>
  );
};

export default Loader;
