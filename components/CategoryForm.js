// components/CategoryForm.js
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import endpoint from "@/utils/endpoint";

export default function CategoryForm({ addCategory }) {
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (category) {
			// Ensuring category is provided; description is optional
			try {
				const adminAccessToken = document.cookie
					.split("; ")
					.find((row) => row.startsWith("adminAccessToken="))
					.split("=")[1];
				const response = await axios.post(
					`${endpoint}/service/add_category/`, // Replace with your actual endpoint URL
					{
						name: category,
						description: description || "", // Pass description only if it exists
					},
					{
						headers: {
							Authorization: `Bearer ${adminAccessToken}`, // Send the adminAccessToken in the Authorization header
						},
					}
				);
				console.log("Category added successfully:", response.data);
				addCategory({ category, description });
				setCategory("");
				setDescription("");
			} catch (error) {
				if (error.response) {
					// The request was made, and the server responded with a status code that falls out of the range of 2xx
					console.error("Error data:", error.response.data);
					console.error("Error status:", error.response.status);
					console.error("Error headers:", error.response.headers);
				} else if (error.request) {
					// The request was made, but no response was received
					console.error("No response received:", error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.error("Error setting up request:", error.message);
				}
				console.error("Axios config:", error.config);
			}
		}
	};

	return (
		<motion.div
			className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-[70%] mx-auto mt-8 min-h-[500px] flex flex-col justify-center"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-gray-700 font-semibold">
						Category Name
					</label>
					<input
						type="text"
						className="border mt-1 py-2 px-4 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						placeholder="Enter category name"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-semibold">
						Description
					</label>
					<textarea
						className="mt-1 border py-2 px-4 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Enter category description"
					/>
				</div>
				<motion.button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full font-semibold"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					Add Category
				</motion.button>
			</form>
		</motion.div>
	);
}
