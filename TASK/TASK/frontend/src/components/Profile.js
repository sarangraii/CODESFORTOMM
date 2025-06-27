import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone_no: "",
    gender: "",
    dob: ""
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
        setFormData({
          fullname: response.data.fullname || "",
          email: response.data.email || "",
          phone_no: response.data.phone_no || "",
          gender: response.data.gender || "",
          dob: response.data.dob ? response.data.dob.split('T')[0] : ""
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
        
        // If token is invalid, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUser(response.data);
      setIsEditing(false);
      // Show success message
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>{isEditing ? "Edit Profile" : "Your Profile"}</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        {user && !isEditing && (
          <div className="profile-details">
            <div className="profile-photo">
              <div className="default-avatar">
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            
            <div className="profile-info">
              <div className="info-group">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.fullname}</span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{user.phone_no}</span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Gender</span>
                <span className="info-value">
                  {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                </span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {new Date(user.dob).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={toggleEdit}>
                Cancel
              </button>
            </div>
          </form>
        )}
        
        <div className="profile-actions">
          {!isEditing && (
            <button className="edit-profile-btn" onClick={toggleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;