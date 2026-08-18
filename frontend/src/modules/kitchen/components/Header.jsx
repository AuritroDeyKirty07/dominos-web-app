import { UserCircle } from "lucide-react";

function Header() {
    return (
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                    Kitchen Dashboard
                </h1>

                <p className="text-sm font-medium text-slate-500 mt-1">
                    Manage today's orders
                </p>
            </div>

            <div className="flex items-center gap-3">

                <div className="text-right hidden sm:block">
                    <p className="font-bold text-slate-800">
                        Kitchen Staff
                    </p>

                    <p className="text-xs font-semibold text-green-600">
                        ● Online
                    </p>
                </div>

                <UserCircle className="w-10 h-10 text-[#006491]" />

            </div>

        </header>
    );
}

export default Header;