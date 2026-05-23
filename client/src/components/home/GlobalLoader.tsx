import "./GlobalLoader.css";

const GlobalLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p className="loader-text">Loading, please wait...</p>
    </div>
  );
};

export default GlobalLoader;
