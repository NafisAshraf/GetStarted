import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const VerifyUser = () => {
  const { token } = useParams();
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleVerification = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/verify-user/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();
      console.log(data);
      setVerificationMessage(data.message);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleVerification();
    }
  }, [token, handleVerification]);

  return (
    <div className=" container d-flex flex-column align-items-center justify-content-center text-black py-5">
      <div className="container p-5 border border-2 rounded rounded-3 w-75">
        <h2>VERIFY USER</h2>
        <hr />
        <p className="fs-5">
          {verificationMessage}
          {verificationMessage === "User verified successfully" ? (
            <p className="mt-3">
              <a href="/login" className="btn btn-dark">
                Login
              </a>
            </p>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default VerifyUser;
