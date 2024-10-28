import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../store/userSlice'; 
import { toast } from 'sonner';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';

const AddUserForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector((state: any) => state.users.error); // Assuming error state is managed in userSlice
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        selectedWard: '', // Can be string or number
        role: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const resultAction = await dispatch(addUser(formData)); // Send as plain object
            unwrapResult(resultAction); // This will throw if the action was rejected
            toast.success('User added successfully');
            setFormData({ username: '', email: '', selectedWard: '', role: '' }); // Reset form
        } catch (err: any) {
            // Handle errors similarly to the Login component
            if (error?.fieldErrors) {
                // Display specific field errors
                Object.keys(error.fieldErrors).forEach((field) => {
                    toast.error(error.fieldErrors[field]);
                });
            } else {
                toast.error('Failed to add user: ' + (err.message || 'Unknown error occurred.'));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-2/5">
            <div className="flex flex-col items-start">
                <label className="text-left w-full mb-2 p-2 text-light">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    className="p-2 border border-gray-300 rounded" 
                />
                {error?.fieldErrors?.username && (
                    <div className="error-message">{error.fieldErrors.username}</div>
                )}
            </div>
            <div className="flex flex-col items-start">
                <label className="text-left w-full mb-2 p-2 text-light">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    className="p-2 border border-gray-300 rounded" 
                />
                {error?.fieldErrors?.email && (
                    <div className="error-message">{error.fieldErrors.email}</div>
                )}
            </div>
            <div className="flex flex-col items-start">
                <label className="text-left w-full mb-2 p-2 text-light">Ward No</label>
                <select 
                    name="selectedWard" 
                    value={formData.selectedWard} 
                    onChange={handleChange} 
                    required
                >
                    <option value="" disabled>Select a ward</option>
                    {/* Populate options dynamically */}
                </select>
            </div>
            <div className="flex flex-col items-start">
                <label className="text-left w-full mb-2 p-2 text-light">Roles</label>
                <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    required
                >
                    <option value="" disabled>Select a role</option>
                    {/* Populate options dynamically */}
                </select>
            </div>
            <div className="login-button">
                <button
                    className="btn-normal btn-normal--medium btn-blue btn-transition bold button_highlight"
                    type="submit"
                >
                    Add User
                </button>
            </div>
            {error?.message && <div className="error-message">{error.message}</div>}
        </form>
    );
};

export default AddUserForm;
