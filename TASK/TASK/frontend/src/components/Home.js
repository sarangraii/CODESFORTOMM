import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Optional: Keep if needed for background or custom styles
import homeimage from '../Images/home1.jpeg';  // Background image

const Home = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black">
      {/* Background Image */}
      <img 
        src={homeimage} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-80" 
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Centered Register Button */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Welcome And Sign Up Here 
        </h1>
        <Link
          to="/register"
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
        >
          Register Free
        </Link>
      </div>
    </div>
  );
};

export default Home;
