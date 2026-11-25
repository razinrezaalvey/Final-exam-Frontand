
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    ShieldCheck,
    Clock,
    MapPin,
    ArrowRight,
    CheckCircle2,
    Headphones,
    Warehouse,
    ShoppingBag,
} from "lucide-react";

const services = [
    {
        icon: Package,
        title: "Parcel Delivery",
        description: "Send your parcels safely and quickly to any destination.",
    },
    {
        icon: Truck,
        title: "Express Delivery",
        description: "Fast delivery solutions for your urgent shipments.",
    },
    {
        icon: Warehouse,
        title: "Business Logistics",
        description: "Reliable logistics support for growing businesses.",
    },
];

const features = [
    {
        icon: ShieldCheck,
        title: "Secure Delivery",
        description: "Your parcels are handled with care and security.",
    },
    {
        icon: Clock,
        title: "On-Time Delivery",
        description: "We value your time and deliver as scheduled.",
    },
    {
        icon: MapPin,
        title: "Live Tracking",
        description: "Track your parcel and stay updated at every step.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Our support team is ready to help you.",
    },
];

const steps = [
    "Book Your Parcel",
    "We Pick It Up",
    "Track Your Shipment",
    "Receive Your Parcel",
];

const Home = () => {
    return (
        <div className="overflow-hidden bg-white">

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 via-white to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">

                    <div>
                        <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <ShieldCheck size={17} />
                            Fast, Safe & Reliable Delivery
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                            Delivering Your
                            <span className="text-emerald-600"> Trust </span>
                            Every Mile.
                        </h1>

                        <p className="mt-6 text-gray-600 leading-8 max-w-xl">
                            Send parcels anywhere with confidence.
                            Experience smarter, faster and more secure
                            courier services with SwiftCourier.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-4 rounded-xl font-semibold transition"
                            >
                                Book a Parcel
                                <ArrowRight size={19} />
                            </Link>

                            <Link
                                to="/about"
                                className="border border-gray-300 hover:border-emerald-600 text-slate-800 px-7 py-4 rounded-xl font-semibold transition"
                            >
                                Learn More
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-10">
                            {["Secure Shipping", "Fast Delivery", "Easy Tracking"].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle2 size={17} className="text-emerald-600" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-200/30 rounded-full blur-3xl" />

                        <img
                            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=85"
                            alt="Courier logistics warehouse and parcel delivery"
                            className="relative w-full h-[320px] sm:h-[420px] object-cover rounded-3xl shadow-2xl"
                        />

                        <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-xl">
                                <Truck className="text-emerald-600" size={27} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Smart Delivery</h3>
                                <p className="text-sm text-gray-500">Your parcel, our responsibility.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parcel Tracking */}
            <section className="max-w-5xl mx-auto px-4 py-16">
                <div className="bg-slate-950 rounded-3xl p-7 sm:p-12 text-center">
                    <Package size={38} className="text-emerald-400 mx-auto mb-4" />

                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Track Your Parcel
                    </h2>

                    <p className="text-gray-400 mt-3 mb-8">
                        Enter your tracking number to check your delivery status.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const trackingId = new FormData(e.currentTarget).get("trackingId");
                            if (trackingId?.trim()) {
                                window.location.href = `/track?trackingId=${encodeURIComponent(trackingId.trim())}`;
                            }
                        }}
                        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
                    >
                        <input
                            type="text"
                            name="trackingId"
                            required
                            maxLength={64}
                            placeholder="Enter your tracking ID"
                            className="flex-1 min-w-0 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />

                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-4 rounded-xl font-semibold transition"
                        >
                            Track Now
                        </button>
                    </form>
                </div>
            </section>

            {/* Services */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            Our Services
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                            Delivery Solutions For Everyone
                        </h2>
                        <p className="text-gray-500 mt-4 leading-7">
                            Reliable and flexible delivery services designed
                            for individuals and businesses.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <div
                                    key={service.title}
                                    className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition duration-300"
                                >
                                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                                        <Icon size={28} className="text-emerald-600" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-500 mt-3 leading-7">
                                        {service.description}
                                    </p>

                                    <Link
                                        to="/services"
                                        className="inline-flex items-center gap-2 mt-6 text-emerald-600 font-semibold"
                                    >
                                        Learn More <ArrowRight size={17} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            Why Choose Us
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                            We Make Delivery Simple & Secure
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div key={feature.title} className="text-center p-5">
                                    <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <Icon size={30} className="text-emerald-600" />
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mt-5">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-7 mt-3">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-emerald-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-14">
                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            Simple Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
                            How It Works
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
                        {steps.map((step, index) => (
                            <div key={step} className="bg-white p-7 rounded-2xl text-center shadow-sm">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                                    {index + 1}
                                </div>

                                <h3 className="font-bold text-slate-900 mt-5">
                                    {step}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto bg-slate-950 rounded-3xl px-6 py-14 sm:p-16 text-center">
                    <ShoppingBag size={38} className="text-emerald-400 mx-auto mb-5" />

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Ready To Send Your Parcel?
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-7">
                        Join SwiftCourier and experience reliable,
                        secure and hassle-free parcel delivery.
                    </p>

                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold mt-8 transition"
                    >
                        Get Started Now
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
