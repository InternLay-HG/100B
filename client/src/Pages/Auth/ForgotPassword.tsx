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
    <form
      onSubmit={handleSubmit}
      className="p-8 w-full max-w-md rounded-lg border border-gray-200 bg-white"
    >
      <div className="mb-4 text-center">
        <h1 className="font-bold text-2xl">Forgot Password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email address to reset your password
        </p>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 focus-visible:ring-orange-500"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
        </div>
      </div>
      <div className="mb-4">
        {loading ? (
          <Button disabled className="w-full bg-orange-500 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full text-white bg-orange-500 hover:bg-orange-600"
          >
            Send Reset Link
          </Button>
        )}
      </div>
      <p className="mt-2 text-sm text-center">
        Back to{" "}
        <Link to="/login" className="text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default ForgotPassword;


