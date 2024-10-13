import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { useNavigate } from 'react-router-dom';
import { passwordStrength } from 'check-password-strength';
import LoginWithGithub from '../components/login/LoginWithGithub';
import LoginWithGoogle from '../components/login/LoginWithGoogle';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setStrength(passwordStrength(newPassword).value);
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername.length > 15 || newUsername.length < 3) {
      setError("Username must be between 3 and 15 characters");
    } else {
      setError(''); // Clear error if valid
    }
  };

  const createDefaultLists = (userId) => {
    const defaultLists = [
      { title: 'Favourite', listType: 'Favourite' },
      { title: 'To Watch', listType: 'To Watch' },
    ];
    defaultLists.forEach((list) => {
      Meteor.call('list.create', { userId, title: list.title, listType: list.listType, content: [] }, (error) => {
        if (error) {
          console.error('Error creating default list:', error.reason);
        }
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering && (username.length < 3 || username.length > 15)) {
      setError("Username must be between 3 and 15 characters");
      return;
    }


    if (isRegistering) {
      Accounts.createUser({ email, username, password }, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          createDefaultLists(Meteor.userId());
          navigate('/search'); // Redirect to /search upon successful sign-up
        }
      });
    } else {
      Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
          setError("Username or Password Incorrect");
        } else {
          navigate('/search'); // Redirect to /search upon successful login
        }
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        backgroundImage: `url(images/login-background.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: 'center',
      }}
    >
      <h1 className="text-3xl mb-4 text-white font-bold">The Watchlist</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full max-w-xs bg-darker/90 px-5 py-7 rounded-2xl">

        <h1 className="text-white font-bold text-3xl mb-7 mt-2">
          {isRegistering ? 'Sign Up' : 'Login'}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 pl-4 mb-5 bg-dark text-white rounded-full"
          required
        />

        {isRegistering && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="w-full p-2 pl-4 mb-5 bg-dark text-white rounded-full"
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          minLength={6}
          className="w-full p-2 pl-4 bg-dark text-white rounded-full"
          required
        />

        {/* Password Strength Indicator */}
        {password && (
          <div className="w-full mt-2 space-y-2">
            {/* Progress Bar */}
            {isRegistering && (
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div
                    style={{
                      width:
                        strength === 'Too weak'
                          ? '25%'
                          : strength === 'Weak'
                            ? '50%'
                            : strength === 'Medium'
                              ? '75%'
                              : '100%',
                    }}
                    className={`flex flex-col text-center whitespace-nowrap text-white justify-center ${strength === 'Too weak'
                      ? 'bg-red-600'
                      : strength === 'Weak'
                        ? 'bg-yellow-500'
                        : strength === 'Medium'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Strength Label */}
            {isRegistering && (<p
              className={`text-center text-xs font-semibold ${strength === 'Too weak'
                ? 'text-red-600'
                : strength === 'Weak'
                  ? 'text-yellow-500'
                  : strength === 'Medium'
                    ? 'text-blue-500'
                    : 'text-green-500'
                }`}
            >
              {strength === 'Too weak'
                ? 'Password is too weak. Consider adding numbers, symbols, and more characters.'
                : strength === 'Weak'
                  ? 'Password is weak. Add a mix of uppercase, lowercase, and special characters.'
                  : strength === 'Medium'
                    ? 'Password is decent but could be stronger.'
                    : 'Strong password!'}
            </p>
            )}

          </div>
        )}

        {error && <p className="text-red-600 p-2 font-semibold ">{error}</p>}
        <button type="submit" className="w-2/3 p-1.5 mt-3 mb-3 bg-magenta font-bold text-white rounded-full hover:bg-pink-700">
          {isRegistering ? 'Sign Up' : 'Log In'}
        </button>

        <p className="text-white text-xs font-thin">
          {isRegistering ? "Have an account?" : "Don't have an account?"}
          <a
            className="font-bold"
            href="#" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? " Login!" : " Sign Up!"}
          </a>
        </p>

        <div className='flex flex-row w-full items-center mt-8 mb-5'>
          <hr className='w-full h-px bg-white' />
          <p className=' text-white px-1 text-sm'>or</p>
          <hr className='w-full h-px bg-white' />
        </div>

        <div className="flex flex-col w-full py-1 items-center">
          <div className="w-3/4 mb-5">
            <LoginWithGithub />
          </div>
          <div className="w-3/4">
            <LoginWithGoogle />
          </div>
        </div>

      </form>

    </div>
  );
};

export default LoginPage;
