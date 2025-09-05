import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EmailVerificationPage = () => {
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [isResending, setIsResending] = useState(false);
	const [resendTimer, setResendTimer] = useState(60);
	const [checkOtp, setCheckOtp] = useState('');
	const [loading, setLoading] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const data = location?.state;

	useEffect(() => {
		toast.info('Click on send Otp to send verification code');
	}, [])

	useEffect(() => {
		if (!data) {
			navigate("/signup");
			toast.error("You must signup first");
		}
	}, [data, navigate]);

	const handleOtpChange = (value: any, index: number) => {
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && /^\d$/.test(value)) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	const handleKeyDown = (e: any, index: number) => {
		if (e.key === "Backspace" && otp[index] === "") {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			if (prevInput) prevInput.focus();
		}
	};

	const handleResendOTP = useCallback(async () => {
		setIsResending(true);
		setResendTimer(60);
		try {
			const response = await axios.post("/api/v1/verify/otp", { id: data.id, mailTo: data.email });
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
		const otpString = otp.join("");
		if (checkOtp === otpString) {
			try {
				setLoading(true);
				const { name, email, branch, year, password } = data;
				const response = await axios.post('/api/v1/signup', {
					name,
					email,
					branch,
					year,
					password
				})
				console.log(response);
				toast.success('Email verified successfully');
				navigate('/login');
			} catch (error: any) {
				console.log(error);
				if (error.response.data.message)
					toast.error(error.response.data.message);
				else
					toast.error('Failed to verify email');
			} finally {
				setLoading(false);
			}
		} else {
			toast.error('Wrong OTP, please try again!');
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-black">
			<h2 className="text-2xl font-semibold mb-2">Verification Code</h2>
			<p className="text-gray-600">Please type the verification code sent to your email.</p>
			<p className="text-gray-600 mb-6">{data?.email}</p>

			<div className="flex space-x-4">
				{otp.map((digit, index) => (
					<input
						key={`otp-${index}`}
						id={`otp-${index}`}
						value={digit}
						onChange={(e) => handleOtpChange(e.target.value, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						className="w-12 h-12 bg-white border border-gray-300 text-black text-center text-xl font-mono outline-none focus:border-black transition-all duration-300"
						maxLength={1}
					/>
				))}

			</div>

			{loading ? (
				<Button disabled className="w-32 mt-6">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
				</Button>
			) : (
				<Button type="submit" onClick={handleVerifyOTP} className="w-32 mt-6">
					Verify
				</Button>
			)}

			<div className="mt-4">
				{isResending ? (
					<p className="text-gray-500">You can resend OTP in {resendTimer} seconds</p>
				) : (
					<button
						onClick={handleResendOTP}
						className="text-black underline hover:text-blue-900"
					>
						send OTP
					</button>
				)}
			</div>
		</div>
	);
};

export default EmailVerificationPage;
