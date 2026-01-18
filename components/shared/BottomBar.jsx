import {
  Home,
  Store,
  Video,
  PlusCircle,
  UserCircle2,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useAppContext } from "@/context/context";

export default function BottomBar({ onUserClick }) {
  const { pathname } = useAppContext();

  const items = [
    { name: "Home", icon: Home, href: "/app" },
    { name: "Reels", icon: Video, href: "/app/reels" },
    { name: "Post", icon: PlusCircle, href: "/app/create" },
    { name: "Shop", icon: Store, href: "/app/shop" },
  ];

  const isMessageRoute = pathname?.startsWith('/app/message');

  return (
    <div className={`fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white text-gray-700 flex justify-around items-center py-2 md:hidden z-40 shadow-lg`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex flex-col items-center text-xs transition-all py-2 px-3 rounded-lg",
              pathname === item.href 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
            )}
          >
            <Icon size={24} strokeWidth={pathname === item.href ? 2.5 : 2} />
          </Link>
        );
      })}
      <button
        onClick={onUserClick}
        className="flex flex-col items-center text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all py-2 px-3 rounded-lg"
      >
        <UserCircle2 size={24} strokeWidth={2} />
      </button>
    </div>
  );
}