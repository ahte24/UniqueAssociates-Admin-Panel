// components/NavbarWrapper.js
"use client"; // This is a client component

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
	const pathname = usePathname();
	const showNavbar = pathname !== "/";

	return showNavbar ? <Navbar /> : null;
}
