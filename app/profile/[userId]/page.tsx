// EMERGENCY DEBUG VERSION - Replace your entire file with this temporarily
"use client";

import { useEffect, useState } from "react";

// STEP 1: Test if ANY JavaScript is running
console.log("🚨 EMERGENCY TEST: JavaScript is working!");
alert("🚨 EMERGENCY TEST: If you see this alert, JavaScript is working!");

export default function UserProfilePage() {
  console.log("🚨 COMPONENT: UserProfilePage is rendering!");
  
  useEffect(() => {
    console.log("🚨 EFFECT: useEffect is running!");
  }, []);

  return (
    <div style={{
      backgroundColor: "red",
      color: "white",
      padding: "50px",
      fontSize: "24px",
      textAlign: "center",
      border: "10px solid blue"
    }}>
      <h1>🚨 EMERGENCY DEBUG TEST</h1>
      <p>If you can see this RED box with BLUE border, React is working!</p>
      <p>Check your console for logs and you should have seen an alert!</p>
      
      <div style={{
        backgroundColor: "yellow",
        color: "black",
        padding: "20px",
        margin: "20px",
        border: "5px solid green"
      }}>
        <h2>BASIC TEST PASSED</h2>
        <p>Component is rendering successfully</p>
      </div>
    </div>
  );
}
