import React from "react";

function Login() {
  return (
    <div className="credentials">
      <h1 className="heading">Login</h1>
      <form action="">
        <input type="text" className="input" placeholder="Username" required />
        <input type="text" className="input" placeholder="Password" required />
        <button className="login">Login</button>
        <p className="sign">
          Not signed up?<a href=""> Create Account</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
