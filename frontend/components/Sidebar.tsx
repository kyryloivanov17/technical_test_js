"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/create-interests", label: "Create interests" },
    { href: "/get-interests", label: "Get interests" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-lg">
      <div className="p-4 font-bold text-lg border-b border-gray-300 text-black">
        OB Technical Test
      </div>
      <nav className="p-4 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block p-2 text-center rounded-md ${
              pathname === item.href
                ? "bg-blue-500 text-white "
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
