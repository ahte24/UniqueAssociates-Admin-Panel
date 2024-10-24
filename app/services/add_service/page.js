"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ServiceForm from "@/components/ServiceForm";
import Cookies from "js-cookie";

import Link from "next/link";

export default function AddServicePage() {
	const [categories, setCategories] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const loggedInStatus = document.cookie
			.split("; ")
			.find((row) => row.startsWith("adminAccessToken="));
		if (!loggedInStatus) {
			router.push("/"); // Redirect to login page if not logged in
			return;
		}

		// Load categories from local storage
		const savedCategories =
			JSON.parse(localStorage.getItem("categories")) || [];
		setCategories(savedCategories);
	}, [router]);

	const addCategory = (category) => {
		const updatedCategories = [...categories, category];
		setCategories(updatedCategories);
		localStorage.setItem("categories", JSON.stringify(updatedCategories));
	};

	const addService = (service) => {
		const savedServices = JSON.parse(localStorage.getItem("services")) || [];
		savedServices.push(service);
		localStorage.setItem("services", JSON.stringify(savedServices));
		// router.push("/orders"); // Redirect back to services page
	};


	return (
		<>

			<div className=" w-[100vw] bg-gray-400 ">
				<div className=" mx-auto  pt-8 bg-gray-100 rounded-lg shadow-lg">
					<h2 className="text-2xl  font-bold text-center">Add New Service</h2>
					<div className="min-h-screen p-2 bg-gray-100 gap-8 md:flex  ">
						<ServiceForm categories={categories} addService={addService} />
					</div>
				</div>
			</div>
		</>
	);
}
