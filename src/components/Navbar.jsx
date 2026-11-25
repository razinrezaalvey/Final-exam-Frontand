
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Package, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthContext } from "../context/AuthProvider";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthContext();
    const navigate = useNavigate();

    const dashboardPath =
        user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "agent"
            ? "/agent/dashboard"
            : "/customer/dashboard";

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate("/login");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Track Parcel", path: "/track" },
        { name: "Contact", path: "/contact" },
    ];

    const linkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-200 ${
            isActive
                ? "text-emerald-600"
                : "text-gray-600 hover:text-emerald-600"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center">
                            <Package size={25} className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900">
                                Swift<span className="text-emerald-600">Courier</span>
                            </h1>
                            <p className="text-[10px] tracking-widest text-gray-500 uppercase">
                                Fast & Secure Delivery
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={linkClass}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={dashboardPath}
                                    className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                                >
                                    <LayoutDashboard size={17} />
                                    {user?.full_name?.split(" ")[0] || "Dashboard"}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-md shadow-emerald-100"
                                >
                                    Get Started
                                    <ArrowRight size={17} />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="lg:hidden border-t border-gray-100 py-5">
                        <div className="flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={linkClass}
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={dashboardPath}
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                                        >
                                            <LayoutDashboard size={17} />
                                            Dashboard ({user?.full_name?.split(" ")[0] || "User"})
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex justify-center items-center gap-2 py-3 font-semibold text-red-600"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="text-center py-3 font-semibold text-gray-700"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                                        >
                                            Get Started
                                            <ArrowRight size={17} />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
