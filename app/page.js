"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import endpoint from "@/utils/endpoint";
// import { cookies } from "next/headers";

export default function LoginPage() {
	const router = useRouter();
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [responseMessage, setResponseMessage] = useState("");
	const [adminAccessToken, setadminAccessToken] = useState(
		Cookies.get("adminAccessToken") || ""
	);
	const [adminRefreshToken, setadminRefreshToken] = useState("");

	// Handle input changes for login credentials
	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials((prevCredentials) => ({
			...prevCredentials,
			[name]: value,
		}));
	};

	// Function to set a cookie
	const setCookie = (name, value, hours) => {
		const date = new Date();
		date.setTime(date.getTime() + hours * 60 * 60 * 1000);
		const expires = "expires=" + date.toUTCString();
		document.cookie = `${name}=${value};${expires};path=/;Secure;SameSite=Strict`;
	};

	// Handle form submission for login
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${endpoint}/token/`,
				{
					username: credentials.email,
					password: credentials.password,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status === 200) {
				const token = response.data;
				setadminAccessToken(token.access);
				setadminRefreshToken(token.refresh);

				// Store tokens in cookies
				setCookie("adminAccessToken", token.access, 12);
				setCookie("adminRefreshToken", token.refresh, 12);

				setResponseMessage("Successfully authenticated!");
				router.push("/orders");
			}
		} catch (error) {
			if (error.response) {
				setResponseMessage(
					`Error: ${error.response.data.message || "Invalid credentials"}`
				);
			} else if (error.request) {
				setResponseMessage(
					"No response received from the server. Please try again later."
				);
			} else {
				setResponseMessage("Something went wrong. Please try again later.");
			}
			console.error("Error:", error);
		}
	};

	// Function to refresh the access token using the refresh token
	const adminRefreshTokenf = async (adminRefreshToken) => {
		try {
			const response = await axios.post(
				`${endpoint}/token/refresh/`,
				{
					refresh: adminRefreshToken,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status === 200) {
				const { access } = response.data;
				setadminAccessToken(access);
				// Update the access token in the cookie
				setCookie("adminAccessToken", access, 12);
				console.log("Access token refreshed:", access);
				Cookies.remove("adminRefreshToken");
			}
		} catch (error) {
			console.error("Error refreshing access token:", error);
			if (error.response && error.response.status === 401) {
				setResponseMessage("Session expired, please log in again.");
				router.push("/login"); // Redirect to login page
			}
		}
	};

	// Function to check for the refresh token and refresh it after 4.9 minutes
	const setupTokenRefresh = () => {
		const token = Cookies.get("adminRefreshToken");
		if (token) {
			setTimeout(() => {
				adminRefreshTokenf(token);
			}, 2000); // Wait 4.9 minutes (4.9 * 60 * 1000 ms)
		} else {
			console.log("Refresh token not found, skipping refresh.");
		}
	};

	// Use effect to set up the token refresh on mount
	useEffect(() => {
		if (adminRefreshToken) {
			setupTokenRefresh(); // Set up the refresh to happen once after 4.9 minutes
		}
	}, [adminRefreshToken]);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
				<h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Username</label>
						<input
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							placeholder="name@company.com"
							required
							type="text"
							name="email"
							id="email"
							onChange={handleChange}
							value={credentials.email}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Password</label>
						<input
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							type="password"
							name="password"
							id="password"
							onChange={handleChange}
							value={credentials.password}
							placeholder="••••••••"
							required
							autoComplete="true"
						/>
					</div>
					<p className="text-red-500 mt-4">{responseMessage}</p>
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
