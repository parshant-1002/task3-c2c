import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { ChatContext } from '../../Context/ChatContext'
import "./styles.css"
const Login = () => {

  const { dispatch } = useContext(ChatContext);
  
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    dispatch({ type: "RESET" });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Slack</span>
        <span className="title">Login</span>
        <form className="form" onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="email" />
          <input className="input"  type="password" placeholder="password" />
          <button className="Signin">Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p className="p">You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;