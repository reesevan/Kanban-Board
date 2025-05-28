import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData);
      Auth.login(data.token);
      navigate("/board");
    } catch (err) {
      console.error("Failed to login", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password}
          onChange={handleChange}
        />
        <button type='submit'>Submit Form</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
