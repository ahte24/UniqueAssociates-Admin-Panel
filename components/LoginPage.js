// components/LoginPage.js
"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage({ onLogin }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter(); // Initialize router

	const handleLogin = (e) => {
		e.preventDefault();

		// Simple validation and hardcoded credentials
		if (username === "admin" && password === "admin123") {
			localStorage.setItem("isLoggedIn", "true"); // Set login state in localStorage
			onLogin(true); // Update login status
			router.push("/"); // Redirect to home page after successful login
		} else {
			setError("Invalid username or password");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<span className="ml-3 text-xl font-bold text-[#044c80]">
					TaxClickIn
				</span>
				<form onSubmit={handleLogin}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Username</label>
						<input
							type="text"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							type="password"
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
