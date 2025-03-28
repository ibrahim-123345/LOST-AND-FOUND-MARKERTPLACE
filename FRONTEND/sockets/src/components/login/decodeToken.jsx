
import {React} from "react";
import useAuthStore from "../store/authStore";


import {jwtDecode} from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true; 

  try {
    const { exp } = jwtDecode(token); 
   
    const{object:{userename,role}}=jwtDecode(token)
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUsername(userename);
    useAuthStore.getState().setRole(role);
   
   
   
    
    
    if (!exp) return true; 

    const currentTime = Date.now() / 1000; 
    return exp < currentTime; 
  } catch (error) {
    console.error("Invalid token:", error);
    return true; 
  }
};


const token = localStorage.getItem("token");

if (isTokenExpired(token)) {
  console.log("Token has expired. Redirecting to login...");

} else {
  console.log("Token is valid!");
}



export default isTokenExpired;
