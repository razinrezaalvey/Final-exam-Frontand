
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Mail,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    KeyRound,
    CheckCircle2,
} from "lucide-react";
import Api from "../../services/Api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await Api.post("/api/v1/auth/forgot-password", { email: email.trim() });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">

            <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">

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

                        <div className="mt-24">

                            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                                <KeyRound size={32} className="text-emerald-400" />
                            </div>

                            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mt-8">
                                Forgot Your
                                <span className="text-emerald-400"> Password?</span>
                            </h1>

                            <p className="text-gray-400 mt-6 leading-8 max-w-md">
                                Don't worry! It happens. Enter your registered
                                email address and follow the instructions to
                                regain access to your account.
                            </p>

                        </div>

                        <div className="mt-12 space-y-6">

                            {[
                                "Simple password recovery",
                                "Secure reset process",
                                "Protect your account",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}

                        </div>

                    </div>

                    <div className="relative z-10 flex items-center gap-3 text-gray-500 text-sm mt-16">
                        <ShieldCheck size={20} className="text-emerald-400" />
                        Your security is our priority.
                    </div>

                </div>

                {/* Right Reset Form */}
                <div className="p-6 sm:p-10 lg:p-16 flex items-center">

                    <div className="max-w-md w-full mx-auto">

                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
                            <Package className="text-emerald-600" size={30} />

                            <h2 className="text-xl font-extrabold text-slate-900">
                                Swift<span className="text-emerald-600">Courier</span>
                            </h2>
                        </div>

                        {/* Icon */}
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                            <KeyRound size={30} className="text-emerald-600" />
                        </div>

                        <div className="mb-8">

                            <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                Account Recovery
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                                Reset Password
                            </h2>

                            <p className="text-gray-500 text-sm mt-4 leading-7">
                                Enter your registered email address. If an
                                account matches, we will send instructions
                                to reset your password.
                            </p>

                        </div>

                        {/* Success Message */}
                        {success && (
                            <div
                                role="status"
                                className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                            >
                                <div className="flex gap-3">
                                    <CheckCircle2 className="text-emerald-600 shrink-0" size={21} />

                                    <div>
                                        <h3 className="text-emerald-800 font-bold text-sm">
                                            Request Submitted!
                                        </h3>

                                        <p className="text-emerald-700 text-sm mt-1 leading-6">
                                            If an account matches this email,
                                            password reset instructions will be sent.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                            >
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div>

                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@email.com"
                                            autoComplete="email"
                                            maxLength={254}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-100"
                                >
                                    {loading ? "Sending Request..." : "Send Reset Instructions"}

                                    {!loading && <ArrowRight size={19} />}
                                </button>

                            </form>
                        )}

                        {/* Back To Login */}
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-emerald-600 font-semibold mt-10 transition"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>

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

export default ForgotPassword;
