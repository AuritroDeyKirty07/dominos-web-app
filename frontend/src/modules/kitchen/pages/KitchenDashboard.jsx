import { useEffect, useState } from "react";
import {
    ClipboardList,
    CookingPot,
    CheckCircle,
    RefreshCw
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";

import Navbar from "../../../shared/components/Navbar";
import {
    getKitchenOrders,
    getReadyKitchenOrders
} from "../services/kitchenApi";

function KitchenDashboard() {

    const [orders, setOrders] = useState([]);
    const [activePage, setActivePage] = useState("dashboard");
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {

        try {
            setLoading(true);

            const [activeData, readyData] = await Promise.all([
                getKitchenOrders(),
                getReadyKitchenOrders()
            ]);

            setOrders([
                ...(activeData.orders || []),
                ...(readyData.orders || [])
            ]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const activeOrders = orders.filter(
        order =>
            order.status === "Placed" ||
            order.status === "Preparing"
    );

    const readyOrders = orders.filter(
        order => order.status === "Ready"
    );

    const displayedOrders =
        activePage === "active"
            ? activeOrders
            : activePage === "ready"
                ? readyOrders
                : orders;

    const title =
        activePage === "active"
            ? "Active Orders"
            : activePage === "ready"
                ? "Ready Orders"
                : "Kitchen Dashboard";

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-100" style={{ paddingTop: '70px' }}>
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />

                <div className="flex-1 min-w-0 overflow-y-auto">

                    <Header />

                <main className="p-6 lg:p-8">

                    {/* Heading */}
                    <div className="flex items-center justify-between mb-8">

                        <div>
                            <h2 className="text-3xl font-black text-slate-900">
                                {title}
                            </h2>

                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Manage kitchen orders
                            </p>
                        </div>

                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#006491] hover:bg-[#00557a] text-white rounded-xl font-bold text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>

                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                        <div className="bg-white border-2 border-[#006491] p-5 shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-[#006491]">
                                        Total Orders
                                    </p>

                                    <p className="text-3xl font-black text-slate-900 mt-2">
                                        {orders.length}
                                    </p>
                                </div>

                                <ClipboardList className="w-8 h-8 text-[#006491]" />
                            </div>
                        </div>

                        <div className="bg-white border-2 border-[#E31837] p-5 shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-[#E31837]">
                                        Active Orders
                                    </p>

                                    <p className="text-3xl font-black text-orange-500 mt-2">
                                        {activeOrders.length}
                                    </p>
                                </div>

                                <CookingPot className="w-8 h-8 text-[#E31837]" />
                            </div>
                        </div>

                        <div className="bg-white border-2 border-green-600 p-5 shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-green-600">
                                        Ready Orders
                                    </p>

                                    <p className="text-3xl font-black text-green-600 mt-2">
                                        {readyOrders.length}
                                    </p>
                                </div>

                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                    </div>

                    {/* Orders */}
                    <div>

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-xl font-black text-slate-900">
                                {activePage === "dashboard"
                                    ? "All Orders"
                                    : activePage === "active"
                                        ? "Active Orders"
                                        : "Ready Orders"}
                            </h3>

                            <span className="text-sm font-semibold text-slate-400">
                                {displayedOrders.length} orders
                            </span>

                        </div>

                        {loading ? (

                            <div className="bg-white border border-slate-200 p-12 text-center">
                                <p className="font-bold text-slate-500">
                                    Loading orders...
                                </p>
                            </div>

                        ) : displayedOrders.length === 0 ? (

                            <div className="bg-white border border-slate-200 p-12 text-center">
                                <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />

                                <p className="font-bold text-slate-500 mt-3">
                                    No orders found
                                </p>
                            </div>

                        ) : (

                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                                {displayedOrders.map(order => (
                                    <OrderCard
                                        key={order._id}
                                        order={order}
                                        refreshOrders={fetchOrders}
                                    />
                                ))}

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>
        </div>
    );
}

export default KitchenDashboard;