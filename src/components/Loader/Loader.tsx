import React from "react";
import "./Loader.css";

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
