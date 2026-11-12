
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    Clock,
    Building2,
    Wallet,
    MapPin,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Globe,
    Headphones,
} from "lucide-react";

const Services = () => {

    const services = [
        {
            icon: Package,
            title: "Parcel Delivery",
            description:
                "Send your parcels safely and conveniently to any destination with our reliable delivery network.",
            features: [
                "Easy parcel booking",
                "Safe package handling",
                "Delivery status updates",
            ],
            tag: "Popular Service",
        },
        {
            icon: Zap,
            title: "Express Delivery",
            description:
                "Need something delivered quickly? Choose our express service for faster parcel transportation.",
            features: [
                "Priority parcel handling",
                "Faster delivery process",
                "Real-time updates",
            ],
            tag: "Fast Delivery",
        },
        {
            icon: Clock,
            title: "Same Day Delivery",
            description:
                "Get your important parcels delivered on the same day with our dedicated delivery solutions.",
            features: [
                "Same-day delivery option",
                "Priority scheduling",
                "Quick parcel processing",
            ],
            tag: "Time Saving",
        },
        {
            icon: Building2,
            title: "Business Logistics",
            description:
                "Smart logistics support designed for online businesses, retailers and growing companies.",
            features: [
                "Bulk parcel management",
                "Business shipping support",
                "Centralized shipment tracking",
            ],
            tag: "For Business",
        },
        {
            icon: Wallet,
            title: "Cash On Delivery",
            description:
                "Make online shopping easier with convenient cash collection during parcel delivery.",
            features: [
                "Cash collection service",
                "Payment status tracking",
                "Convenient order delivery",
            ],
            tag: "Easy Payment",
        },
        {
            icon: MapPin,
            title: "Real-Time Tracking",
            description:
                "Stay informed about your shipment journey with convenient parcel tracking.",
            features: [
                "Unique tracking number",
                "Shipment status updates",
                "Delivery progress visibility",
            ],
            tag: "Smart Tracking",
        },
    ];

    const benefits = [
        {
            icon: ShieldCheck,
            title: "Secure Handling",
            description:
                "We prioritize safe parcel handling and responsible delivery operations.",
        },
        {
            icon: Truck,
            title: "Reliable Network",
            description:
                "A convenient delivery management experience for customers and businesses.",
        },
        {
            icon: Headphones,
            title: "Customer Support",
            description:
                "Get assistance whenever you need help with your delivery experience.",
        },
        {
            icon: Globe,
            title: "Easy Management",
            description:
                "Manage your shipments and monitor delivery progress from one platform.",
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
                        OUR SERVICES
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight max-w-4xl mx-auto">
                        Delivery Solutions
                        <span className="text-emerald-400 block">
                            Made Simple.
                        </span>
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto mt-7 text-base sm:text-lg leading-8">
                        From everyday parcel delivery to business logistics,
                        discover smarter and more convenient shipping
                        solutions with SwiftCourier.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-10">

                        <Link
                            to="/signup"
                            className="btn bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-xl px-7"
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/contact"
                            className="btn btn-outline border-gray-600 text-white hover:bg-white hover:text-slate-900 rounded-xl px-7"
                        >
                            Talk To Us
                        </Link>

                    </div>

                </div>
            </section>

            {/* Services Cards */}
            <section className="py-20 lg:py-28 px-4">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center max-w-2xl mx-auto mb-16">

                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            What We Offer
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                            Our Delivery Services
                        </h2>

                        <p className="text-gray-500 mt-5 leading-7">
                            Explore our range of delivery and logistics
                            solutions designed to make shipping easier.
                        </p>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <div
                                    key={service.title}
                                    className="group relative bg-white border border-gray-100 rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
                                >

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition duration-300">

                                            <Icon
                                                size={28}
                                                className="text-emerald-600 group-hover:text-white transition"
                                            />

                                        </div>

                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-full">
                                            {service.tag}
                                        </span>

                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-7">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-7 mt-4 min-h-20">
                                        {service.description}
                                    </p>

                                    <div className="border-t border-gray-100 mt-6 pt-6 space-y-4">

                                        {service.features.map((feature) => (
                                            <div
                                                key={feature}
                                                className="flex items-center gap-3 text-sm text-gray-600"
                                            >
                                                <CheckCircle2
                                                    size={17}
                                                    className="text-emerald-600 shrink-0"
                                                />

                                                {feature}
                                            </div>
                                        ))}

                                    </div>

                                    <Link
                                        to="/contact"
                                        className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-8 group-hover:gap-4 transition-all"
                                    >
                                        Learn More
                                        <ArrowRight size={18} />
                                    </Link>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* Why Choose Us */}
            <section className="bg-gray-50 py-20 lg:py-28 px-4">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center max-w-2xl mx-auto mb-14">

                        <span className="text-emerald-600 text-sm font-bold uppercase tracking-widest">
                            Why SwiftCourier
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                            Why Choose Our Services?
                        </h2>

                        <p className="text-gray-500 mt-5 leading-7">
                            We focus on making every step of your delivery
                            experience simple, transparent and convenient.
                        </p>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div
                                    key={benefit.title}
                                    className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition"
                                >

                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">

                                        <Icon
                                            size={27}
                                            className="text-emerald-600"
                                        />

                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mt-6">
                                        {benefit.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-7 mt-3">
                                        {benefit.description}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* CTA Section */}
            <section className="px-4 py-20 lg:py-28">

                <div className="max-w-7xl mx-auto bg-emerald-600 rounded-3xl p-9 sm:p-14 lg:p-16 text-center relative overflow-hidden">

                    <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl -top-32 -right-10" />

                    <div className="relative z-10">

                        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-7">
                            <Truck size={34} className="text-white" />
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
                            Let's Make Your Next Delivery Easier.
                        </h2>

                        <p className="text-emerald-50 mt-5 max-w-xl mx-auto leading-7">
                            Create your account and discover a smarter
                            way to manage your parcels with SwiftCourier.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-9">

                            <Link
                                to="/signup"
                                className="btn bg-white text-emerald-700 hover:bg-gray-100 border-none rounded-xl px-7"
                            >
                                Create Account
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

export default Services;
