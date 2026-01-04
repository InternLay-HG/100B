import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import axios from '@/api/axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const ACCESS_TOKEN_SECRET = import.meta.env.VITE_ACCESS_TOKEN_SECRET;

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  if (!token) {
    toast.error('Invalid reset link')
    navigate('/login');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = jwtDecode(token!, ACCESS_TOKEN_SECRET);
      if (!user) {
        toast.error('Invalid reset token');
        navigate('/login')
      } else {
        await axios.patch('/api/v1/user',
          { password: newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('Password changed successfully');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Something went wrong, please try again!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">Enter your new password to reset the old one</p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="pl-10"
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="pl-10"
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled className="">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="text-white bg-black">
            Reset Password
          </Button>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;