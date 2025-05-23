// this is going to represent a wrapper for a protected route
// The idea is: if we wrap something in ProtectedRoute components,
// then we need to have an authorization token before we can access that route

import { Navigate } from "react-router-dom";
// import jwtDecode from "jwt-decode";
// import api from "../api";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect } from "react";

// children is the component that we want to protect (what will be wrapped)
function ProtectedRoute({ children }) {
  // we need to check if we are authorized before we can access the route
  // otherwise we need to redirect them and tell them they need to log in before they can access the route
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  // function that is going to refresh our token automatically
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      // send a request to backend with the refresh token to get a new access token
      const res = await api.post("/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        // i.e: it was successful
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  // function that is going to check if we need to refresh our token or if we are good to go
  const auth = async () => {
    // first check if we have an access token
    // and if we have one, check if it's expired or not
    // if it's expired, we need to refresh it automatically
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    // if have a toke, decode it so that we can get the expiration date and check if it's expired or not
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000; // current time in seconds

    if (tokenExpiration < now) {
      // if the token is expired, we need to refresh it
      await refreshToken();
    } else {
      // if the token is not expired, we are good to go
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    // return <div>Loading...</div>;
    return null;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
