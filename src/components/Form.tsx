import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { options, wardrolesoption } from '@/types/SelectWardOptions';
import { addUser } from '../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';
import { toast } from 'sonner';

const AddUserForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector((state: any) => state.user.error);
    const fieldErrors = useSelector((state: any) => state.user.fieldErrors);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        selectedWard: '',
        role: '',
    });

    const defaultRoles = wardrolesoption;
    const [roles, setRoles] = useState(defaultRoles);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'selectedWard') {
            if (value === 'nagarpalika') {
                setRoles([{ value: "projectEditor", label: "Project Editor" }]);
            } else {
                setRoles(defaultRoles);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { username, email, selectedWard, role } = formData;
        try {
            const resultAction = await dispatch(addUser({ username, email, selectedWard, role }));
            unwrapResult(resultAction);
            setFormData({ username: '', email: '', selectedWard: '', role: '' });
            toast.success('User added successfully!'); // Show success message
        } catch (err: any) {
            // Error handling is done in the slice
            toast.error(err.message || 'Failed to add user'); // Show error message
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-4/5 grid grid-cols-2 gap-2">
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light capitalize">Username</Label>
                <Input 
                    name="username" 
                    placeholder="Enter username" 
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                {fieldErrors.username && <div className="error-message">{fieldErrors.username}</div>}
            </div>
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light capitalize">Email</Label>
                <Input 
                    name="email" 
                    placeholder="Enter email" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
            </div>
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light capitalize">Ward No</Label>
                <select 
                    name="selectedWard" 
                    value={formData.selectedWard} 
                    onChange={handleChange} 
                    required
                >
                    <option value="" disabled>Select a ward</option>
                    {options.map((ward) => (
                        <option key={ward.value} value={ward.value}>
                            {ward.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col items-start">
                <Label className="text-left w-full mb-2 p-2 text-light capitalize">Roles</Label>
                <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    required
                >
                    <option value="" disabled>Select a role</option>
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-center mt-4 mb-4">
                <button type="submit" className="btn btn-primary">
                    Add User
                </button>
                {error && <div className="error-message">{error.message}</div>} {/* Show general error if exists */}
            </div>
        </form>
    );
};

export default AddUserForm;
