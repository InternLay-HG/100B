import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50/80 via-gray-50 to-gray-100 flex flex-col">
      <header className="w-full pt-8 pb-6 px-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-500">Agora</p>
              <p className="text-sm text-gray-600 mt-1">
                Centralized platform for IIIT, Ranchi
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500 max-w-xs">
                You must have IIIT Ranchi email to access this website
              </p>
            </div>
          </div>
          <div className="md:hidden mt-3">
            <p className="text-xs text-gray-500 text-center">
              You must have IIIT Ranchi email to access this website
            </p>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
