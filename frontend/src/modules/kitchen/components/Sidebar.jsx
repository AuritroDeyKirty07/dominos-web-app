import {
    LayoutDashboard,
    ClipboardList,
    CheckCircle,
    ChefHat
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
    const menu = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            id: "active",
            label: "Active Orders",
            icon: ClipboardList
        },
        {
            id: "ready",
            label: "Ready Orders",
            icon: CheckCircle
        }
    ];

    return (
        <aside className="w-64 h-full bg-white text-[#006491] flex flex-col shrink-0 border-r border-slate-200">

            {/* Logo */}
            <div className="px-6 py-7 border-b border-slate-200">
                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 bg-[#006491] flex items-center justify-center">
                        <ChefHat className="w-7 h-7 text-white" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-black text-[#006491]">
                            Domino's
                        </h1>

                        <p className="text-xs font-semibold text-slate-500">
                            Kitchen
                        </p>
                    </div>

                </div>
            </div>

            {/* Menu */}
            <nav className="p-4 space-y-2">

                <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Menu
                </p>

                {menu.map(({ id, label, icon: Icon }) => (

                    <button
                        key={id}
                        onClick={() => setActivePage(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left font-bold transition border ${
                            activePage === id
                                ? "bg-[#006491] text-white border-[#006491]"
                                : "text-[#006491] border-transparent hover:bg-blue-50 hover:border-blue-100"
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </button>

                ))}

            </nav>

            {/* Bottom Status */}
            <div className="mt-auto p-4">

                <div className="bg-blue-50 p-4 border border-blue-100">

                    <div className="flex items-center justify-between">

                        <span className="font-bold text-[#006491]">
                            Kitchen Status
                        </span>

                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                            <span className="w-2 h-2 bg-green-600" />
                            Online
                        </span>

                    </div>

                    <div className="border-t border-blue-200 mt-3 pt-3">

                        <p className="text-xs text-slate-500">
                            Kitchen Staff
                        </p>

                        <p className="font-bold mt-1 text-[#006491]">
                            Staff Member
                        </p>

                        <p className="text-xs text-green-600 mt-2">
                            ● Available for orders
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;