
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import {
    Package,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Truck,
    CheckCircle2,
} from "lucide-react";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        role: "customer",
        password: "",
        confirm_password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Basic password strength indicator
    const getPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error("Password must contain at least 8 characters.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                full_name: formData.full_name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim() || undefined,
                password: formData.password,
                role: formData.role || "customer",
            };

            await register(payload);
            toast.success("Account created successfully! Please login.");
            navigate("/login");
        } catch (err) {
            const errorMsg =
                err.response?.data?.error?.message ||
                err.response?.data?.detail ||
                "Registration failed. Please check your inputs.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

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
                                Join Our Platform
                            </span>

                            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mt-5">
                                Deliver More.
                                <span className="text-emerald-400"> Worry Less.</span>
                            </h1>

                            <p className="text-gray-400 mt-6 leading-8 max-w-md">
                                Create your SwiftCourier account and experience
                                a smarter, faster and more secure delivery system.
                            </p>
                        </div>

                        <div className="mt-12 space-y-6">
                            {[
                                "Easy parcel booking",
                                "Real-time parcel tracking",
                                "Secure account management",
                                "Reliable delivery service",
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
                        Your delivery journey starts here.
                    </div>
                </div>

                {/* Signup Form */}
                <div className="p-6 sm:p-10 lg:p-12">

                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <Package className="text-emerald-600" size={30} />
                        <h2 className="text-xl font-extrabold text-slate-900">
                            Swift<span className="text-emerald-600">Courier</span>
                        </h2>
                    </div>

                    <div className="max-w-md mx-auto">

                        <div className="mb-8">
                            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                Create Account
                            </span>

                            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                                Get Started Today!
                            </h2>

                            <p className="text-gray-500 text-sm mt-3">
                                Enter your details to create your SwiftCourier account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        maxLength={100}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

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

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+880 1XXXXXXXXX"
                                        autoComplete="tel"
                                        maxLength={20}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Account Role */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Account Type
                                </label>

                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            role: "customer"
                                        }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition ${
                                            formData.role === "customer"
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-gray-200 text-gray-500 hover:border-emerald-300"
                                        }`}
                                    >
                                        <User size={18} />
                                        Customer
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            role: "agent"
                                        }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition ${
                                            formData.role === "agent"
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-gray-200 text-gray-500 hover:border-emerald-300"
                                        }`}
                                    >
                                        <Truck size={18} />
                                        Delivery Agent
                                    </button>

                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Agent accounts require admin approval before delivery assignments.
                                </p>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={128}
                                        required
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-3">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1.5 flex-1 rounded-full ${
                                                        passwordStrength >= level
                                                            ? passwordStrength <= 2
                                                                ? "bg-red-500"
                                                                : passwordStrength <= 3
                                                                    ? "bg-yellow-500"
                                                                    : "bg-emerald-500"
                                                            : "bg-gray-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Password strength: {
                                                passwordStrength <= 2
                                                    ? "Weak"
                                                    : passwordStrength <= 3
                                                        ? "Medium"
                                                        : "Strong"
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        maxLength={128}
                                        required
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                    </button>
                                </div>

                                {formData.confirm_password && (
                                    <p className={`text-xs mt-2 ${
                                        formData.password === formData.confirm_password
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                    }`}>
                                        {formData.password === formData.confirm_password
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 text-sm text-gray-500">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 accent-emerald-600"
                                />
                                <span>
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-emerald-600 font-semibold">
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-emerald-600 font-semibold">
                                        Privacy Policy
                                    </Link>.
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-100"
                            >
                                {loading ? "Please wait..." : "Create Account"}
                                {!loading && <ArrowRight size={19} />}
                            </button>

                        </form>

                        <div className="relative my-7">
                            <div className="border-t border-gray-200" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-xs text-gray-400">
                                OR
                            </span>
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                                Login Now
                            </Link>
                        </p>

                        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-400">
                            <ShieldCheck size={17} className="text-emerald-600" />
                            Your account information is protected.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
