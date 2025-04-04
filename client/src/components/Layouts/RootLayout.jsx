import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import SidebarComp from "../Sidebar/SidebarComp";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-300">
        <Navbar />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r border-gray-300">
          <SidebarComp />
        </aside>
        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
