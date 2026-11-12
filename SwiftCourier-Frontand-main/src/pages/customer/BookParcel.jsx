import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/Api';
import {
  Package,
  User,
  Phone,
  MapPin,
  Weight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  Info,
} from 'lucide-react';

const initialForm = {
  senderName: '',
  senderPhone: '',
  senderAddress: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: '',
  parcelType: 'Document',
  weight: '1',
  service: 'Regular',
  cod: false,
  codAmount: '',
};

// Defined OUTSIDE BookParcel component to prevent unmounting & focus loss on keystroke
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  type = 'text',
  required = true,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}

      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 ${
          error ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
        }`}
      />
    </div>

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {error}
      </p>
    )}
  </div>
);

const BookParcel = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [createdParcel, setCreatedParcel] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Real-time estimated delivery charge calculation
  const deliveryCharge = useMemo(() => {
    const weight = Math.max(0, Number(formData.weight) || 0);
    const baseCharge = formData.service === 'Express' ? 75 : 50;
    const extraWeightCharge = Math.max(0, weight - 1) * 10;
    const codCharge = formData.cod ? (Number(formData.codAmount) || 0) * 0.01 : 0;
    return Math.round(baseCharge + extraWeightCharge + codCharge);
  }, [formData.weight, formData.service, formData.cod, formData.codAmount]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }

    if (!formData.senderPhone.trim() || formData.senderPhone.length < 7) {
      newErrors.senderPhone = 'Enter a valid phone number';
    }

    if (!formData.senderAddress.trim()) {
      newErrors.senderAddress = 'Pickup address is required';
    }

    if (!formData.receiverName.trim()) {
      newErrors.receiverName = 'Receiver name is required';
    }

    if (!formData.receiverPhone.trim() || formData.receiverPhone.length < 7) {
      newErrors.receiverPhone = 'Enter a valid phone number';
    }

    if (!formData.receiverAddress.trim()) {
      newErrors.receiverAddress = 'Delivery address is required';
    }

    if (!formData.weight || Number(formData.weight) <= 0) {
      newErrors.weight = 'Enter a valid parcel weight';
    }

    if (formData.cod && (!formData.codAmount || Number(formData.codAmount) <= 0)) {
      newErrors.codAmount = 'Enter a valid COD amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapParcelType = (type) => {
    const map = {
      Document: 'document',
      Electronics: 'electronics',
      Clothing: 'clothing',
      Food: 'food',
      'Fragile Item': 'fragile',
      Other: 'other',
    };
    return map[type] || 'other';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please resolve the highlighted form errors.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        sender_name: formData.senderName.trim(),
        sender_phone: formData.senderPhone.trim(),
        sender_address: formData.senderAddress.trim(),
        receiver_name: formData.receiverName.trim(),
        receiver_phone: formData.receiverPhone.trim(),
        receiver_address: formData.receiverAddress.trim(),
        pickup_address: formData.senderAddress.trim(),
        delivery_address: formData.receiverAddress.trim(),
        parcel_type: mapParcelType(formData.parcelType),
        parcel_weight: parseFloat(formData.weight) || 1.0,
        cod_amount: formData.cod ? parseFloat(formData.codAmount) || 0.0 : 0.0,
        special_instruction: `${formData.service} delivery service requested.`,
      };

      const res = await api.post('/api/v1/parcels', payload);
      setCreatedParcel(res.data);
      setSuccess(true);
      toast.success('Parcel booked successfully!');
    } catch (err) {
      const details = err.response?.data?.error?.details;
      let msg = err.response?.data?.error?.message || err.response?.data?.detail || 'Failed to book parcel.';
      if (Array.isArray(details) && details.length > 0) {
        msg = details.map((d) => `${d.field.replace('body.', '')}: ${d.message}`).join(', ');
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
    setSuccess(false);
    setCreatedParcel(null);
  };

  if (success && createdParcel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={42} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
            Parcel Booked Successfully!
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Your parcel delivery request has been registered in our logistics system.
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center">
            <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Tracking Number</span>
            <p className="text-2xl font-black text-emerald-700 mt-1 select-all">{createdParcel.tracking_number}</p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left space-y-3">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">Sender</span>
              <span className="font-bold text-slate-800">{createdParcel.sender_name}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">Receiver</span>
              <span className="font-bold text-slate-800">{createdParcel.receiver_name}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-slate-500">Weight</span>
              <span className="font-bold text-slate-800">{createdParcel.parcel_weight} KG</span>
            </div>

            <div className="flex justify-between gap-3 border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-700">Official Delivery Charge</span>
              <span className="text-lg font-extrabold text-emerald-600">
                ৳ {createdParcel.delivery_charge}
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/customer/parcels"
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700"
            >
              View My Parcels
            </Link>

            <button
              onClick={resetForm}
              className="w-full rounded-xl border border-slate-200 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Book Another Parcel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Link
            to="/customer/dashboard"
            className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900 md:text-2xl">
              Book a Parcel
            </h1>
            <p className="text-xs text-slate-500 md:text-sm">
              Fill in the details to create a new live shipment.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* Page Intro */}
        <div className="mb-8">
          <p className="font-bold uppercase tracking-widest text-emerald-600">
            SwiftCourier Services
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Send Your Parcel <span className="text-emerald-600">Anywhere.</span>
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Provide accurate sender and receiver information to dispatch your shipment.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid items-start gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="space-y-7 lg:col-span-2">
              {/* Sender Information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <User size={23} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Sender Information
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the pickup person's details.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Sender Name"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    error={errors.senderName}
                    placeholder="Enter sender name"
                    icon={User}
                  />

                  <InputField
                    label="Phone Number"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    error={errors.senderPhone}
                    placeholder="01XXXXXXXXX"
                    icon={Phone}
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Pickup Address"
                      name="senderAddress"
                      value={formData.senderAddress}
                      onChange={handleChange}
                      error={errors.senderAddress}
                      placeholder="House, road, area, city"
                      icon={MapPin}
                    />
                  </div>
                </div>
              </section>

              {/* Receiver Information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin size={23} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Receiver Information
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Where should we deliver your parcel?
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Receiver Name"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    error={errors.receiverName}
                    placeholder="Enter receiver name"
                    icon={User}
                  />

                  <InputField
                    label="Phone Number"
                    name="receiverPhone"
                    value={formData.receiverPhone}
                    onChange={handleChange}
                    error={errors.receiverPhone}
                    placeholder="01XXXXXXXXX"
                    icon={Phone}
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Delivery Address"
                      name="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={handleChange}
                      error={errors.receiverAddress}
                      placeholder="House, road, area, city"
                      icon={MapPin}
                    />
                  </div>
                </div>
              </section>

              {/* Parcel Details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Package size={23} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Parcel Details
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Select your parcel type and weight.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Parcel Type
                    </label>
                    <select
                      name="parcelType"
                      value={formData.parcelType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option>Document</option>
                      <option>Electronics</option>
                      <option>Clothing</option>
                      <option>Food</option>
                      <option>Fragile Item</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <InputField
                    label="Parcel Weight (KG)"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    error={errors.weight}
                    placeholder="Enter weight in kg"
                    icon={Weight}
                    type="number"
                  />

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      Delivery Service
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          value: 'Regular',
                          title: 'Regular Delivery',
                          description: 'Standard delivery service',
                          price: '৳ 50 base',
                        },
                        {
                          value: 'Express',
                          title: 'Express Delivery',
                          description: 'Priority delivery service',
                          price: '৳ 75 base',
                        },
                      ].map((service) => (
                        <label
                          key={service.value}
                          className={`cursor-pointer rounded-xl border p-4 transition ${
                            formData.service === service.value
                              ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                              : 'border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900">
                                {service.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {service.description}
                              </p>
                              <p className="mt-3 text-sm font-bold text-emerald-600">
                                {service.price}
                              </p>
                            </div>

                            <input
                              type="radio"
                              name="service"
                              value={service.value}
                              checked={formData.service === service.value}
                              onChange={handleChange}
                              className="radio radio-success"
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Cash on Delivery */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Calculator size={23} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      Cash on Delivery (COD)
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Allow the delivery agent to collect parcel payment from the receiver.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="cod"
                    checked={formData.cod}
                    onChange={handleChange}
                    className="checkbox checkbox-success h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {formData.cod && (
                  <div className="mt-6">
                    <InputField
                      label="Cash Collection Amount (৳)"
                      name="codAmount"
                      value={formData.codAmount}
                      onChange={handleChange}
                      error={errors.codAmount}
                      placeholder="Enter collection amount"
                      icon={Calculator}
                      type="number"
                    />
                  </div>
                )}
              </section>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? 'Booking Parcel...' : 'Confirm Live Booking'} <ArrowRight size={20} />
              </button>
            </div>

            {/* Summary Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Calculator size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Booking Summary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Estimated delivery charge
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Service</span>
                    <span className="font-semibold text-slate-800">
                      {formData.service}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Parcel Type</span>
                    <span className="font-semibold text-slate-800">
                      {formData.parcelType}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Weight</span>
                    <span className="font-semibold text-slate-800">
                      {formData.weight || 0} KG
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">COD</span>
                    <span className="font-semibold text-slate-800">
                      {formData.cod ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-5">
                    <p className="text-slate-500">Estimated Total</p>
                    <h2 className="mt-2 text-4xl font-extrabold text-emerald-600">
                      ৳ {deliveryCharge}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-800">
                  <Info size={19} className="shrink-0" />
                  <p>
                    Final charge is verified and recorded server-side by SwiftCourier pricing engine.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950 p-6 text-white">
                <ShieldCheck size={30} className="text-emerald-400" />
                <h3 className="mt-4 text-lg font-bold">
                  Safe & Secure Delivery
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Every parcel is tracked from pickup until successful delivery confirmation.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookParcel;
