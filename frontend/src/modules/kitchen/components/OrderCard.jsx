import {
    Pizza,
    User,
    Clock3,
    CheckCircle
} from "lucide-react";

import {
    startPreparingOrder,
    markOrderReady
} from "../services/kitchenApi";

function OrderCard({ order, refreshOrders }) {

    const startPreparing = async () => {
        await startPreparingOrder(order._id);
        refreshOrders();
    };

    const markReady = async () => {
        await markOrderReady(order._id);
        refreshOrders();
    };

    const status = {
        Placed: {
            text: "NEW ORDER",
            color: "bg-[#006491] text-white border-[#006491]"
        },
        Preparing: {
            text: "PREPARING",
            color: "bg-[#E31837] text-white border-[#E31837]"
        },
        Ready: {
            text: "READY",
            color: "bg-green-600 text-white border-green-600"
        }
    };

    const current = status[order.status] || {
        text: order.status.toUpperCase(),
        color: "bg-gray-200 text-gray-800 border-gray-300"
    };

    return (
        <div className="bg-white border-2 border-slate-200 shadow-sm transition overflow-hidden">
            <div className={`h-2 ${current.color.split(' ')[0]}`} />

            <div className="p-5">

                {/* Top */}
                <div className="flex items-start justify-between gap-3">

                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                            Order
                        </p>

                        <h2 className="text-2xl font-black text-[#006491]">
                            #{order.orderNumber}
                        </h2>
                    </div>

                    <span className={`px-3 py-1 border-2 text-sm font-bold tracking-wider ${current.color}`}>
                        {current.text}
                    </span>

                </div>

                {/* Customer */}
                <div className="flex items-center gap-2 mt-4 text-[#006491]">

                    <User className="w-4 h-4" />

                    <span className="font-semibold">
                        {order.customerName}
                    </span>

                </div>

                {/* Items */}
                <div className="mt-5 border-t border-b border-slate-200 py-4 space-y-3">

                    {order.items.map((item) => (

                        <div
                            key={item._id}
                            className="flex items-center justify-between"
                        >

                            <div className="flex items-center gap-2">

                                <Pizza className="w-4 h-4 text-[#E31837]" />

                                <span className="font-semibold text-slate-800">
                                    {item.name}
                                </span>

                            </div>

                            <span className="font-bold text-[#006491]">
                                × {item.quantity}
                            </span>

                        </div>

                    ))}

                </div>

                {/* Time */}
                <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 font-medium">

                    <Clock3 className="w-4 h-4" />

                    Fresh kitchen order

                </div>

                {/* Action */}
                <div className="mt-5">

                    {order.status === "Placed" && (
                        <button
                            onClick={startPreparing}
                            className="w-full py-3 bg-[#E31837] hover:bg-red-700 text-white font-bold transition border-2 border-transparent"
                        >
                            Start Preparing
                        </button>
                    )}

                    {order.status === "Preparing" && (
                        <button
                            onClick={markReady}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold transition border-2 border-transparent"
                        >
                            Mark Order Ready
                        </button>
                    )}

                    {order.status === "Ready" && (
                        <button
                            disabled
                            className="w-full py-3 bg-white border-2 border-green-600 text-green-700 font-bold flex items-center justify-center gap-2 opacity-70"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Ready for Delivery
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

export default OrderCard;
