import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex w-full pt-8 pb-5 px-10">
        <p className="text-2xl font-bold text-orange-500">Agora</p>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
