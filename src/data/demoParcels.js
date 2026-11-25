
export const demoParcels = [
  {
    id: 1,
    trackingId: "SWC-2026-10025",
    status: "In Transit",
    sender: "Rahim Ahmed",
    senderPhone: "01712345678",
    senderAddress: "Dhanmondi, Dhaka",
    receiver: "Karim Hasan",
    receiverPhone: "01812345678",
    receiverAddress: "Agrabad, Chattogram",
    parcelType: "Electronics",
    weight: "2.5 kg",
    deliveryType: "Express",
    bookingDate: "2026-10-28",
    estimatedDelivery: "2026-11-04",
    deliveryCharge: 200,
    codAmount: 1500,
    paymentStatus: "COD Pending",
    history: [
      { title: "Parcel Booked", location: "Dhaka", date: "2026-10-28 10:30 AM", completed: true },
      { title: "Parcel Picked Up", location: "Dhanmondi, Dhaka", date: "2026-10-28 12:00 PM", completed: true },
      { title: "In Transit", location: "Dhaka Sorting Hub", date: "2026-10-29 09:00 AM", completed: true },
      { title: "Out for Delivery", location: "Chattogram", date: "Expected soon", completed: false },
      { title: "Delivered", location: "Receiver address", date: "Pending", completed: false }
    ]
  }
];
