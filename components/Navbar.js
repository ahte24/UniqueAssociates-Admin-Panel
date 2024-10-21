"use client";
import React from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Navbar = () => {
	const router = useRouter();
	const handleLogout = () => {
		Cookies.remove("adminAccessToken");
		router.push("/"); // Redirect to login page after logout
	};
	return (
		<header className="text-gray-600 body-font">
			<div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
				<Link
					href="/orders"
					className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
				>
					<span className="ml-3 text-xl font-bold text-[#044c80]">
						TaxClickIn
					</span>
				</Link>
				<nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
					<Link
						href="/services/add_category"
						className="mr-5 hover:text-gray-900"
					>
						Add Category
					</Link>
					<Link
						href="/services/add_service"
						className="mr-5 hover:text-gray-900"
					>
						Add Services
					</Link>
					<Link href="/orders" className="mr-5 hover:text-gray-900">
						All Orders
					</Link>
				</nav>
				<button
					onClick={handleLogout}
					className="inline-flex items-center text-[#044c80] bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
				>
					Logout
					<svg
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						className="w-4 h-4 ml-1"
						viewBox="0 0 24 24"
					>
						<path d="M5 12h14M12 5l7 7-7 7"></path>
					</svg>
				</button>
			</div>
		</header>
	);
};

export default Navbar;
