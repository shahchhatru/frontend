import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { options, wardrolesoption } from '@/types/SelectWardOptions';
import { addUser } from '../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { unwrapResult } from '@reduxjs/toolkit';


const AddUserForm: React.FC = () => {
    const dispatch = useDispatch();
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
            toast.success('User added successfully');
           
            setFormData({ username: '', email: '', selectedWard: '', role: '' });
        } catch (err: any) {
            toast.error('Failed to add user: ' + (err.message || 'Unknown error occurred.'));
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
                    {roles.map((roleOption) => (
                        <option key={roleOption.value} value={roleOption.value}>
                            {roleOption.label}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
        </form>
    );
};

export default AddUserForm;
