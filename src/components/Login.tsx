import React, { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/AuthSlice'; 
import { Loader } from 'semantic-ui-react';
import { toast } from 'sonner';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';

const Login = () => { 
  const dispatch = useDispatch<AppDispatch>();
  const miscInfo = useSelector((state: any) => state.miscInfo.get() || {});
  const error = useSelector((state: any) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [municipalityCode, setMunicipalityCode] = useState('');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(login({ email, password, municipalityCode })); 
      unwrapResult(resultAction);
      toast.success('Login successful');
    } catch (err: any) {
      // Handle error display or logging if necessary
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 w-2/5">
      <div className="flex flex-col items-start">
        <label className="text-left w-full mb-2 p-2 text-light">User</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter username/email"
          required
          className="p-2 border border-gray-300 rounded" 
        />
        {error?.fieldErrors?.email && (
          <div className="error-message">{error.fieldErrors.email}</div>
        )}
      </div>
      <div className="flex flex-col items-start">
        <label className="text-left w-full mb-2 p-2 text-light">Enter your password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password please"
          required
          className="p-2 border border-gray-300 rounded" 
        />
        {error?.fieldErrors?.password && (
          <div className="error-message">{error.fieldErrors.password}</div>
        )}
      </div>
      <div className="flex flex-col items-start">
        <label className="text-left w-full mb-2 p-2 text-light">Municipality code</label>
        <input
          type="text"
          value={municipalityCode}
          onChange={(e) => setMunicipalityCode(e.target.value)}
          placeholder="municipality code"
          required
          className="p-2 border border-gray-300 rounded" 
        />
        {error?.fieldErrors?.municipalityCode && (
          <div className="error-message">{error.fieldErrors.municipalityCode}</div>
        )}
      </div>
      <div className="login-button">
        <button
          className="btn-normal btn-normal--medium btn-blue btn-transition bold button_highlight"
          type="submit"
          disabled={miscInfo?.apiLoading}
        >
          {miscInfo?.apiLoading ? <Loader active inverted inline /> : 'Login'}
        </button>
      </div>
      {error?.message && <div className="error-message">{error.message}</div>}
    </form>
  );
};

export default Login;
