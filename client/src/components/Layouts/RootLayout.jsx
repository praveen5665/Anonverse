import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import SidebarComp from "../Sidebar/SidebarComp";
import { Toaster } from "sonner";
import { useState } from "react";

export default function RootLayout() {
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  const handleCommunityCreated = () => {
    // Increment to trigger sidebar refresh
    setRefreshSidebar((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-300">
        <Navbar onCommunityCreated={handleCommunityCreated} />
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r border-gray-300">
          <SidebarComp refreshTrigger={refreshSidebar} />
        </aside>
        <main className="flex-1 p-10 bg-gray-100">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
