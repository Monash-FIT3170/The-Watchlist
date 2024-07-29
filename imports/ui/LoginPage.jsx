import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createDefaultLists = (userId) => {
    // Define default lists
    const defaultLists = [
      { title: 'Favourite', listType: 'Favourite' },
      { title: 'To Watch', listType: 'To Watch' }
    ];

    defaultLists.forEach(list => {
      Meteor.call('list.create', { userId, title: list.title, listType: list.listType, content: [] }, (error) => {
        if (error) {
          console.error('Error creating default list:', error.reason);
        }
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      Accounts.createUser({ email, username, password }, (err, userId) => {
        if (err) {
          setError(err.reason);
        } else {
          // Create default lists after successful registration
          createDefaultLists(userId);
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
      <h1 className="text-3xl mb-4 text-white">Welcome to The Watchlist</h1>
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
          {isRegistering ? 'Login' : 'Create An Account'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default LoginPage;
