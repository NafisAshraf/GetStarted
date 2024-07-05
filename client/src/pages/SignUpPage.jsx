import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      console.log(fullName, email, password, phoneNumber, userType);
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName,
          email,
          password,
          phoneNumber,
          userType,
        }
      );
      setShowConfirmation(true);
      console.log(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error.response.data);
    }
  };

  return (
    <div className="container-fluid bg-dark text-white vh-100">
      <div className="row bg-dark border-bottom" style={{ height: "10%" }}>
        <Link className="text-decoration-none text-white" to={"/"}>
          <h2 className=" py-4 px-4">Get Started</h2>
        </Link>
      </div>
      <div className="row justify-content-center" style={{ height: "90%" }}>
        {showConfirmation ? (
          <div className="d-flex align-items-center justify-content-center col-12 col-lg-6">
            <div className="container w-75 bg-light rounded rounded-3 p-5">
              <h2 className="text-black text-center">Confirmation</h2>
              <p className="text-black text-center">
                You have successfully registered. Please check your email for
                verification.
              </p>
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center col-12 col-lg-6">
            <div className="container w-75 bg-light rounded rounded-3 p-5">
              <h2 className="text-black text-center">Sign Up</h2>
              <form onSubmit={handleSignUp}>
                <div className="form-group my-3">
                  <label htmlFor="fullName" className="text-black py-2 ps-2">
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="email" className="text-black py-2 ps-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="password" className="text-black py-2 ps-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group my-3">
                  <label
                    htmlFor="Phone Number"
                    className="text-black py-2 ps-2"
                  >
                    Phone Number
                  </label>
                  <input
                    className="form-control"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="userType" className="text-black py-2 ps-2">
                    User Type
                  </label>
                  <select
                    id="userType"
                    className="form-control"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="">Select User Type</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-dark mt-3 px-4 py-2">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
