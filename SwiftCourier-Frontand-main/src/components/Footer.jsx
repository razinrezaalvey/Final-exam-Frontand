
import { Link } from "react-router-dom";
import {
    Package,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Company */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-5">
                            <div className="bg-emerald-600 p-2.5 rounded-xl">
                                <Package size={25} className="text-white" />
                            </div>
                            <h2 className="text-xl font-extrabold text-white">
                                Swift<span className="text-emerald-500">Courier</span>
                            </h2>
                        </Link>

                        <p className="text-sm leading-7 text-gray-400">
                            Fast, reliable and secure delivery solutions.
                            We make parcel delivery easier and smarter for everyone.
                        </p>

                        <div className="flex gap-3 mt-6">
                            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    aria-label={["Facebook", "Instagram", "LinkedIn"][index]}
                                    className="p-2.5 bg-slate-800 rounded-lg hover:bg-emerald-600 transition"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">
                            Quick Links
                        </h3>

                        <ul className="space-y-4 text-sm">
                            <li><Link to="/" className="hover:text-emerald-400">Home</Link></li>
                            <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-emerald-400">Our Services</Link></li>
                            <li><Link to="/track" className="hover:text-emerald-400">Track Parcel</Link></li>
                            <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">
                            Our Services
                        </h3>

                        <ul className="space-y-4 text-sm">
                            <li>Express Delivery</li>
                            <li>Parcel Delivery</li>
                            <li>Same Day Delivery</li>
                            <li>Business Logistics</li>
                            <li>Order Tracking</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">
                            Contact Us
                        </h3>

                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={19} className="text-emerald-500 shrink-0" />
                                <span>Dhaka, Bangladesh</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Phone size={19} className="text-emerald-500 shrink-0" />
                                <span>+880 1700-000000</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail size={19} className="text-emerald-500 shrink-0" />
                                <span>support@swiftcourier.com</span>
                            </li>
                        </ul>

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 mt-6 text-emerald-400 font-semibold text-sm hover:text-emerald-300"
                        >
                            Get in Touch <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-slate-800 mt-14 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} SwiftCourier. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-emerald-400">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-emerald-400">
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
