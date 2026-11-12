
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    ShieldCheck,
    Clock,
    Users,
    MapPin,
    Target,
    Eye,
    HeartHandshake,
    ArrowRight,
    CheckCircle2,
    Globe,
    Zap,
} from "lucide-react";

const About = () => {

    const stats = [
        { number: "10K+", label: "Parcels Delivered", icon: Package },
        { number: "500+", label: "Happy Customers", icon: Users },
        { number: "50+", label: "Delivery Agents", icon: Truck },
        { number: "24/7", label: "Customer Support", icon: Clock },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: "Security First",
            description:
                "We prioritize the safety of every parcel and protect customer information throughout the delivery journey.",
        },
        {
            icon: Clock,
            title: "On-Time Delivery",
            description:
                "We focus on efficient logistics and timely deliveries to make every shipment experience better.",
        },
        {
            icon: HeartHandshake,
            title: "Customer Focus",
            description:
                "Our customers come first. We work to make parcel delivery simple, reliable and convenient.",
        },
        {
            icon: Zap,
            title: "Smart Logistics",
            description:
                "We use modern technology to simplify parcel management and improve delivery operations.",
        },
    ];

    return (
        <div className="bg-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative bg-slate-950 text-white py-24 lg:py-32 px-4">

                <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-40 -right-20" />

                <div className="absolute w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl bottom-0 left-0" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">

                    <span className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-7">
                        ABOUT SWIFTCOURIER
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight max-w-4xl mx-auto">
                        Delivering Trust.
                        <span className="text-emerald-400 block">
                            Connecting People.
                        </span>
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto mt-7 text-base sm:text-lg leading-8">
                        We believe parcel delivery should be simple, fast and
                        reliable. SwiftCourier brings smarter logistics
                        solutions to businesses and individuals.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-10">

                        <Link
                            to="/services"
                            className="btn bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-xl px-7"
                        >
                            Explore Services
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/contact"
                            className="btn btn-outline border-gray-600 text-white hover:bg-white hover:text-slate-900 rounded-xl px-7"
                        >
                            Contact Us
                        </Link>

                    </div>

                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-20 lg:py-28 px-4">

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* Visual */}
                    <div className="relative">

                        <div className="bg-emerald-50 rounded-3xl p-8 sm:p-12 min-h-[350px] flex items-center justify-center relative overflow-hidden">

                            <div className="absolute w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl" />

                            <div className="relative z-10 bg-white rounded-3xl shadow-xl p-10 sm:p-14 text-center">

                                <div className="w-24 h-24 mx-auto bg-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <Package size={48} className="text-white" />
                                </div>

                                <h3 className="text-2xl font-extrabold text-slate-900 mt-6">
                                    SwiftCourier
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    Fast & Secure Delivery
                                </p>

                                <div className="flex justify-center gap-5 mt-8">

                                    <div className="text-center">
                                        <Truck className="text-emerald-600 mx-auto" size={25} />
                                        <p className="text-xs text-gray-500 mt-2">Delivery</p>
                                    </div>

                                    <div className="text-center">
                                        <ShieldCheck className="text-emerald-600 mx-auto" size={25} />
                                        <p className="text-xs text-gray-500 mt-2">Security</p>
                                    </div>

                                    <div className="text-center">
                                        <Globe className="text-emerald-600 mx-auto" size={25} />
                                        <p className="text-xs text-gray-500 mt-2">Network</p>
                                    </div>

                                </div>

                            </div>

                            <div className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-amber-400/80" />

                            <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-emerald-400/70" />

                        </div>

                    </div>

                    {/* Content */}
                    <div>

                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            Who We Are
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 leading-tight">
                            Making Every
                            <span className="text-emerald-600"> Delivery </span>
                            Count.
                        </h2>

                        <p className="text-gray-500 leading-8 mt-6">
                            SwiftCourier is a modern courier and logistics
                            management platform designed to simplify parcel
                            delivery. Our platform connects customers,
                            delivery agents and administrators through one
                            convenient system.
                        </p>

                        <p className="text-gray-500 leading-8 mt-4">
                            From booking a parcel to tracking its journey,
                            we aim to provide a smooth and transparent
                            delivery experience.
                        </p>

                        <div className="space-y-4 mt-8">

                            {[
                                "Easy and convenient parcel booking",
                                "Transparent shipment tracking",
                                "Reliable delivery management",
                                "Secure account management",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle2
                                        size={20}
                                        className="text-emerald-600 shrink-0"
                                    />
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">
                                        {item}
                                    </span>
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </section>

            {/* Statistics Section */}
            <section className="bg-slate-950 py-16 px-4">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-12">

                        <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
                            Our Impact
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
                            Growing With Every Delivery
                        </h2>

                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.label}
                                    className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition"
                                >

                                    <Icon
                                        size={30}
                                        className="text-emerald-400 mx-auto mb-4"
                                    />

                                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                                        {stat.number}
                                    </h3>

                                    <p className="text-gray-400 text-xs sm:text-sm mt-3">
                                        {stat.label}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                    <p className="text-center text-gray-500 text-xs mt-6">
                        Illustrative statistics — replace with verified platform data.
                    </p>

                </div>

            </section>

            {/* Mission & Vision */}
            <section className="py-20 lg:py-28 px-4 bg-gray-50">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center max-w-2xl mx-auto mb-14">

                        <span className="text-emerald-600 text-sm font-bold uppercase tracking-widest">
                            Our Purpose
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                            Mission & Vision
                        </h2>

                        <p className="text-gray-500 mt-4 leading-7">
                            Building a smarter, more connected and reliable
                            delivery experience.
                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition">

                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <Target size={28} className="text-emerald-600" />
                            </div>

                            <h3 className="text-2xl font-extrabold text-slate-900 mt-7">
                                Our Mission
                            </h3>

                            <p className="text-gray-500 leading-8 mt-4">
                                To make parcel delivery easier and more
                                accessible by providing efficient logistics
                                management, transparent tracking and
                                customer-focused services.
                            </p>

                        </div>

                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition">

                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                                <Eye size={28} className="text-amber-600" />
                            </div>

                            <h3 className="text-2xl font-extrabold text-slate-900 mt-7">
                                Our Vision
                            </h3>

                            <p className="text-gray-500 leading-8 mt-4">
                                To become a trusted logistics platform where
                                technology connects people and businesses
                                through smarter and more reliable delivery
                                solutions.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* Core Values */}
            <section className="py-20 lg:py-28 px-4">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center max-w-2xl mx-auto mb-14">

                        <span className="text-emerald-600 text-sm font-bold uppercase tracking-widest">
                            What Makes Us Different
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                            Our Core Values
                        </h2>

                        <p className="text-gray-500 mt-4 leading-7">
                            The principles that guide our approach to
                            delivering better experiences.
                        </p>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {values.map((value) => {
                            const Icon = value.icon;

                            return (
                                <div
                                    key={value.title}
                                    className="group p-7 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
                                >

                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition">

                                        <Icon
                                            size={27}
                                            className="text-emerald-600 group-hover:text-white transition"
                                        />

                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mt-6">
                                        {value.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-7 mt-3">
                                        {value.description}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* CTA Section */}
            <section className="px-4 pb-20 lg:pb-28">

                <div className="max-w-7xl mx-auto bg-emerald-600 rounded-3xl p-9 sm:p-14 lg:p-16 text-center relative overflow-hidden">

                    <div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl -top-32 -right-10" />

                    <div className="relative z-10">

                        <MapPin size={35} className="text-white mx-auto mb-6" />

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
                            Ready to Make Your Deliveries Easier?
                        </h2>

                        <p className="text-emerald-50 mt-5 max-w-xl mx-auto leading-7">
                            Join SwiftCourier and experience a smarter
                            approach to parcel delivery.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-9">

                            <Link
                                to="/signup"
                                className="btn bg-white text-emerald-700 hover:bg-gray-100 border-none rounded-xl px-7"
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/contact"
                                className="btn bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-xl px-7"
                            >
                                Contact Us
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default About;
