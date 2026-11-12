
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
    Package,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Truck,
    CheckCircle2,
} from "lucide-react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const userData = await login(
                formData.email.trim().toLowerCase(),
                formData.password
            );
            toast.success(`Welcome back, ${userData.full_name || 'User'}!`);

            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (userData.role === 'agent') {
                navigate('/agent/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            const errorMsg =
                err.response?.data?.error?.message ||
                err.response?.data?.detail ||
                "Login failed. Please check your email and password.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">

                {/* Left Information Section */}
                <div className="hidden lg:flex flex-col justify-between bg-slate-950 p-12 relative overflow-hidden">

                    <div className="absolute w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl -top-20 -right-20" />

                    <div className="relative z-10">

                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="bg-emerald-600 p-3 rounded-xl">
                                <Package className="text-white" size={27} />
                            </div>

                            <h2 className="text-2xl font-extrabold text-white">
                                Swift<span className="text-emerald-500">Courier</span>
                            </h2>
                        </Link>

                        <div className="mt-20">

                            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">
                                Welcome Back
                            </span>

                            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mt-5">
                                Your Parcels.
                                <span className="text-emerald-400"> Our Priority.</span>
                            </h1>

                            <p className="text-gray-400 mt-6 leading-8 max-w-md">
                                Sign in to manage your shipments, track
                                deliveries and experience smarter logistics
                                with SwiftCourier.
                            </p>

                        </div>

                        <div className="mt-12 space-y-6">
                            {[
                                "Manage your parcels easily",
                                "Track shipments in real time",
                                "Secure account access",
                                "Get delivery updates",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 className="text-emerald-400" size={20} />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-16 flex items-center gap-3 text-gray-500 text-sm">
                        <ShieldCheck className="text-emerald-400" size={20} />
                        Secure access to your delivery account.
                    </div>

                </div>

                {/* Right Login Form */}
                <div className="p-6 sm:p-10 lg:p-16 flex items-center">

                    <div className="max-w-md w-full mx-auto">

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
                            <Package className="text-emerald-600" size={30} />

                            <h2 className="text-xl font-extrabold text-slate-900">
                                Swift<span className="text-emerald-600">Courier</span>
                            </h2>
                        </div>

                        <div className="mb-10">

                            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                Account Login
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                                Welcome Back!
                            </h2>

                            <p className="text-gray-500 text-sm mt-3 leading-6">
                                Enter your credentials to access your account.
                            </p>

                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        autoComplete="email"
                                        maxLength={254}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        minLength={8}
                                        maxLength={128}
                                        required
                                        className={inputClass}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                                    >
                                        {showPassword
                                            ? <EyeOff size={19} />
                                            : <Eye size={19} />
                                        }
                                    </button>

                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-emerald-600"
                                    />
                                    Remember Me
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-emerald-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-100"
                            >
                                {loading ? "Please wait..." : "Login to Account"}

                                {!loading && <ArrowRight size={19} />}
                            </button>

                        </form>

                        {/* Signup Link */}
                        <div className="relative my-8">
                            <div className="border-t border-gray-200" />

                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-xs text-gray-400">
                                OR
                            </span>
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{" "}

                            <Link
                                to="/signup"
                                className="text-emerald-600 font-bold hover:underline"
                            >
                                Create Account
                            </Link>
                        </p>

                        {/* Security Message */}
                        <div className="flex items-center justify-center gap-2 mt-10 text-xs text-gray-400">
                            <ShieldCheck size={17} className="text-emerald-600" />
                            Your account information is protected.
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
