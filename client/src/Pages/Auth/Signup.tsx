import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { Book, Calendar1Icon, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const Signup = () => {

  const [errors, setErrors] = useState<Partial<SignupInputState>>({});
  const navigate = useNavigate();

  const [input, setInput] = useState<SignupInputState>({
    name: "",
    email: "",
    password: "",
    year: "",
    branch: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }

  const signupSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }
    const isCollegeEmail = input.email.split('@')[1].split('.')[0];
    if(isCollegeEmail != 'iiitranchi') {
      toast.error("Use IIIT Ranchi email only");
      return;
    }
    try {
      setLoading(true);
      setInput({ name: '', email: '', password: '', year: '', branch: '' });
      navigate("/verify-email", { state: input });
    } catch (error: any) {
      if (error.response.data.message)
        toast.error(error.response.data.message);
      else
        toast.error('Failed to signup, please try again!');
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={signupSubmitHandler}
      className="p-8 w-full max-w-md rounded-lg border border-gray-200 bg-white"
    >
      <div className="mb-4">
        <h1 className="font-bold text-2xl text-center">Signup for Agora</h1>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Full Name"
            name="name"
            value={input.name}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-orange-500"
          />
          <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-orange-500"
          />
          <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && <span className="text-xs text-red-500">{errors.email}</span>}
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Year"
            name="year"
            value={input.year}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-orange-500"
          />
          <Calendar1Icon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && <span className="text-xs text-red-500">{errors.year}</span>}
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Branch"
            name="branch"
            value={input.branch}
            onChange={changeEventHandler}
            className="pl-10 focus-visible:ring-orange-500"
          />
          <Book className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && <span className="text-xs text-red-500">{errors.branch}</span>}
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
            className="pl-10 focus-visible:ring-orange-500"
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          {errors && <span className="text-xs text-red-500">{errors.password}</span>}
        </div>
      </div>

      <Separator className="mb-2" />
      <div className="mb-10 w-full">
        {loading ? (
          <Button disabled className="w-full bg-orange-500 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
            Signup
          </Button>
        )}
      </div>

      <Separator />
      <p className="mt-2">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;