import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/user', {
        params: {
          email: email
        }
      })
      if(!response.data.user) {
        toast.error('User not found');
      } else {
        const user = response.data.user;
        await axios.post('/api/v1/reset/password', {
          userId: user.id,
          email: email,
          role: user.role
        })
        setEmail('');
        toast.success('Reset link sent successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-600">Enter your email address to reset your password</p>
        </div>
        <div className="relative w-full">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {
          loading ? (
            <Button disabled className=""><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</Button>
          ) : (
            <Button className="bg-black">Send Reset Link</Button>
          )
        }
        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-blue-800">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;


