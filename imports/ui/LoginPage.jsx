import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      Accounts.createUser({ email, username, password }, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          navigate('/home');
        }
      });
    } else {
      Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          navigate('/home');
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkest">
      <h1 className="text-3xl mb-4 text-white">Welcome to My App</h1>
      <button  >Click Me</button>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-dark text-white rounded"
          required
        />
        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 bg-dark text-white rounded"
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-dark text-white rounded"
          required
        />
        <button type="submit" className="w-full p-2 mb-2 bg-magenta text-white rounded hover:bg-pink-700">
          {isRegistering ? 'Register' : 'Log In'}
        </button>
        <button 
          type="button" 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default LoginPage;