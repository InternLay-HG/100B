import axios from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = useCallback( async(e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }
    try {
      setLoading(true);
      const { email, password } = input;
      const response = await axios.post('/api/v1/login', {
        email,
        password
      }, { withCredentials: true })
      dispatch(login({ user: response.data.user, accessToken: response.data.accessToken}));
      navigate('/');
      setInput({email: '', password: ''})
    } catch (error: any) {
      if(error.response.data.message)
        toast.error(error.response.data.message);
      else
        toast.error('Failed to login, please try again');
    } finally {
      setLoading(false);
    }
  }, [dispatch, input, navigate]);

  return (
    <form
      onSubmit={loginSubmitHandler}
      className="p-8 w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
    >
      <div className="mb-8">
        <h1 className="font-extrabold text-3xl text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mt-2 text-sm font-medium">
          Enter your credentials to access your account
        </p>
      </div>
      
      <div className="space-y-5">
        <div className="group">
          <div className="relative transition-all duration-300 focus-within:-translate-y-1">
            <Mail className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-orange-500 pointer-events-none" />
            <Input
              type="email"
              placeholder="Email Address"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 rounded-lg"
            />
            {errors?.email && (
              <span className="absolute -bottom-5 left-0 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="group">
          <div className="relative transition-all duration-300 focus-within:-translate-y-1">
            <LockKeyhole className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-orange-500 pointer-events-none" />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all duration-300 rounded-lg"
            />
            {errors?.password && (
              <span className="absolute -bottom-5 left-0 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                {errors.password}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 mb-6">
        {loading ? (
          <Button disabled className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 rounded-lg">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 rounded-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In
          </Button>
        )}
        
        <div className="mt-4 flex justify-center">
          <Link 
            to="/forgot-password" 
            className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors relative group"
          >
            Forgot Password?
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400 tracking-wider font-medium">Or</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link 
          to="/signup" 
          className="font-semibold text-orange-600 hover:text-orange-700 transition-colors hover:underline decoration-2 underline-offset-2"
        >
          Create Account
        </Link>
      </p>
    </form>
  );;
}

export default Login;