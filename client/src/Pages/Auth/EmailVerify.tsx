import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const EmailVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [checkOtp, setCheckOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const data = location?.state;

  useEffect(() => {
    toast.info("Click on send Otp to send verification code");
  }, []);

  useEffect(() => {
    if (!data) {
      navigate("/signup");
      toast.error("You must signup first");
    }
  }, [data, navigate]);

  const handleResendOTP = useCallback(async () => {
    setIsResending(true);
    setResendTimer(60);
    try {
      const response = await axios.post("/api/v1/verify/otp", {
        mailTo: data.email,
      });
      setCheckOtp(response.data.otp);
      toast.success("OTP has been sent!");

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResending(false);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend OTP. Please try again.");
      setIsResending(false);
    }
  }, [data]);

  const handleVerifyOTP = async () => {
    if (checkOtp === otp) {
      try {
        setLoading(true);
        const { name, email, branch, year, password } = data;
        await axios.post("/api/v1/signup", {
          name,
          email,
          branch,
          year,
          password,
        });
        toast.success("Email verified successfully");
        navigate("/login");
      } catch (error: any) {
        console.log(error);
        if (error.response.data.message)
          toast.error(error.response.data.message);
        else toast.error("Failed to verify email");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Wrong OTP, please try again!");
    }
  };

  return (
    <div className="p-8 w-full max-w-md rounded-lg border border-gray-200 bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Verification Code</h2>
        <p className="text-gray-600">
          Please type the verification code sent to your email.
        </p>
        <p className="text-gray-600">{data?.email}</p>
      </div>

      <div className="flex justify-center mb-6">
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="mb-4">
        {loading ? (
          <Button disabled className="w-full bg-orange-500 text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleVerifyOTP}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Verify
          </Button>
        )}
      </div>

      <div className="mt-4 text-center">
        {isResending ? (
          <p className="text-gray-500">
            You can resend OTP in {resendTimer} seconds
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            className="text-orange-500 hover:underline"
          >
            Send OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
