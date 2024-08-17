import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Privateuserroute = () => {
  const token = localStorage.getItem("authToken");

  // Validation

  if (!token) {
    <Navigate to="/" />;
  }

  // token decode
  try {
    const decodedToken = jwtDecode(token);
console.log(decodedToken)
    const userRole = decodedToken.role;

    if (userRole === "Admin" || userRole === "Manager") {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.log(error);
  }
};

export default Privateuserroute;
