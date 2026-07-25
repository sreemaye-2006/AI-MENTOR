import FloatingBackground from "../components/FloatingBackground";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-950 text-white">
      {/* 
        This is the same background as Login/Register.
        It has to be fixed behind everything.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingBackground />
      </div>
      
      {/* Sidebar fixed to left */}
      <SideBar />
      
      <div className="flex-1 flex flex-col relative z-10 lg:pl-64">
        {/* Top Navbar */}
        <NavBar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
