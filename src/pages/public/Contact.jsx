
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    Headphones,
    ArrowRight,
    ShieldCheck,
    ChevronDown,
    Package,
} from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [activeFaq, setActiveFaq] = useState(0);

    const contactInfo = [
        {
            icon: Phone,
            title: "Call Us",
            value: "+880 1700-000000",
            description: "Our support team is ready to help.",
        },
        {
            icon: Mail,
            title: "Email Us",
            value: "support@swiftcourier.com",
            description: "Send us your questions anytime.",
        },
        {
            icon: MapPin,
            title: "Visit Us",
            value: "Dhaka, Bangladesh",
            description: "Our operations are based in Bangladesh.",
        },
        {
            icon: Clock,
            title: "Working Hours",
            value: "24/7 Support",
            description: "Contact us whenever you need assistance.",
        },
    ];

    const faqs = [
        {
            question: "How can I track my parcel?",
            answer:
                "Visit our Track Parcel page and enter your unique tracking number to check your shipment status.",
        },
        {
            question: "How can I book a parcel?",
            answer:
                "Create an account, sign in and use the parcel booking feature to submit your shipment details.",
        },
        {
            question: "Can I become a delivery agent?",
            answer:
                "Yes. You can register using the Delivery Agent account type. Your application may require administrator approval.",
        },
        {
            question: "What should I do if my parcel is delayed?",
            answer:
                "Contact our support team with your tracking number so the shipment status can be reviewed.",
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
        };

        if (
            !payload.name ||
            !payload.email ||
            !payload.subject ||
            !payload.message
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (
            payload.name.length > 100 ||
            payload.subject.length > 150 ||
            payload.message.length > 2000
        ) {
            setError("Please check the maximum allowed character length.");
            return;
        }

        setLoading(true);

        try {
            // TODO: Connect with FastAPI contact endpoint.
            console.log("Contact form payload:", payload);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setSuccess(true);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch {
            setError("Unable to send your message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    return (
        <div className="bg-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative bg-slate-950 text-white py-24 lg:py-28 px-4">

                <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-40 -right-20" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">

                    <span className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-7">
                        CONTACT US
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        Let's Talk About
                        <span className="text-emerald-400 block">
                            Your Delivery Needs.
                        </span>
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto mt-7 leading-8">
                        Have a question, need assistance or want to learn more
                        about our services? We would love to hear from you.
                    </p>

                    <div className="flex justify-center mt-9">
                        <Link
                            to="/"
                            className="text-gray-400 hover:text-emerald-400 text-sm"
                        >
                            Home
                        </Link>

                        <span className="mx-3 text-gray-600">/</span>

                        <span className="text-emerald-400 text-sm">
                            Contact
                        </span>
                    </div>

                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-4">

                <div className="max-w-7xl mx-auto">

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {contactInfo.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="p-7 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                                >

                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                        <Icon
                                            size={26}
                                            className="text-emerald-600"
                                        />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mt-6">
                                        {item.title}
                                    </h3>

                                    <p className="text-emerald-600 font-semibold text-sm mt-2 break-words">
                                        {item.value}
                                    </p>

                                    <p className="text-gray-500 text-sm mt-3 leading-6">
                                        {item.description}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-gray-50 py-20 px-4">

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">

                    {/* Left Content */}
                    <div className="pt-4">

                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            Get In Touch
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-5 leading-tight">
                            We're Here To
                            <span className="text-emerald-600"> Help You.</span>
                        </h2>

                        <p className="text-gray-500 mt-6 leading-8">
                            Whether you have a delivery question, a business
                            inquiry or need technical support, send us a
                            message. Our team will be happy to assist you.
                        </p>

                        <div className="mt-10 space-y-7">

                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl">
                                    <MessageCircle className="text-emerald-600" size={23} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Quick Assistance
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2 leading-6">
                                        Get help with parcel booking,
                                        tracking and delivery questions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl">
                                    <Headphones className="text-emerald-600" size={23} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Customer Support
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2 leading-6">
                                        We aim to provide a smooth and
                                        helpful customer experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl">
                                    <ShieldCheck className="text-emerald-600" size={23} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Privacy Matters
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-2 leading-6">
                                        Share only the information needed
                                        to help us respond to your inquiry.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-lg border border-gray-100">

                        <div className="mb-8">
                            <h3 className="text-2xl font-extrabold text-slate-900">
                                Send Us A Message
                            </h3>

                            <p className="text-gray-500 text-sm mt-3">
                                Fill out the form below to contact our team.
                            </p>
                        </div>

                        {success && (
                            <div
                                role="status"
                                className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm mb-6"
                            >
                                Your message has passed frontend validation.
                                Backend submission is not connected yet.
                            </div>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-6"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    maxLength={100}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>

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

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is your inquiry about?"
                                    maxLength={150}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Your Message
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows={5}
                                    maxLength={2000}
                                    required
                                    className={`${inputClass} resize-y`}
                                />

                                <p className="text-right text-xs text-gray-400 mt-2">
                                    {formData.message.length}/2000
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-100"
                            >
                                {loading ? "Sending..." : "Send Message"}
                                {!loading && <Send size={18} />}
                            </button>

                        </form>

                    </div>

                </div>

            </section>

            {/* FAQ Section */}
            <section className="py-20 lg:py-28 px-4">

                <div className="max-w-4xl mx-auto">

                    <div className="text-center mb-14">

                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">
                            FAQs
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                            Frequently Asked Questions
                        </h2>

                        <p className="text-gray-500 mt-4 leading-7">
                            Find answers to some common questions.
                        </p>

                    </div>

                    <div className="space-y-4">

                        {faqs.map((faq, index) => (
                            <div
                                key={faq.question}
                                className="border border-gray-200 rounded-2xl overflow-hidden"
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveFaq(
                                            activeFaq === index ? -1 : index
                                        )
                                    }
                                    aria-expanded={activeFaq === index}
                                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-gray-50 transition"
                                >

                                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                                        {faq.question}
                                    </span>

                                    <ChevronDown
                                        size={20}
                                        className={`text-emerald-600 shrink-0 transition-transform ${
                                            activeFaq === index ? "rotate-180" : ""
                                        }`}
                                    />

                                </button>

                                {activeFaq === index && (
                                    <div className="px-5 sm:px-6 pb-6 text-gray-500 text-sm leading-7">
                                        {faq.answer}
                                    </div>
                                )}

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* Bottom CTA */}
            <section className="px-4 pb-20">

                <div className="max-w-7xl mx-auto bg-slate-950 rounded-3xl p-9 sm:p-14 text-center">

                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Package size={32} className="text-emerald-400" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Ready To Send Your Parcel?
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-7">
                        Join SwiftCourier and experience a simpler
                        approach to parcel delivery.
                    </p>

                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold mt-8 transition"
                    >
                        Create Account
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </section>

        </div>
    );
};

export default Contact;
