import axios from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={loginSubmitHandler}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-4">
          <h1 className="font-bold text-2xl">Agora</h1>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && (
              <span className="text-xs text-red-500">{errors.password}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          {loading ? (
            <Button disabled className="w-full bg-black text-white">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full text-white bg-black"
            >
              Login
            </Button>
          )}
          <p className="mt-2 text-sm">
          Forgot{" "}
          <Link to="/forgot-password" className="text-blue-500 text-sm">
            Password?
          </Link>
        </p>
        </div>
        <Separator />
        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 text-sm">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;