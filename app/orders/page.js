"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import endpoint from "@/utils/endpoint";

export default function ServicesPage() {
	const [orders, setOrders] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState(""); // State to track the selected order status
	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const params = {
					order_status: selectedStatus || undefined, // Use selected status, or leave undefined to fetch all
				};

				const response = await axios.get(
					`${endpoint}/order/admin_order_list/`,
					{
						params, // Axios automatically serializes this object to query string
						headers: {
							Authorization: `Bearer ${Cookies.get("adminAccessToken")}`,
						},
					}
				);

				// Sort orders by order_date in descending order
				const sortedOrders = response.data.sort(
					(a, b) => new Date(b.order_date) - new Date(a.order_date)
				);

				setOrders(sortedOrders); // Set the sorted orders
			} catch (error) {
				console.error(
					"Error:",
					error.response ? error.response.data : error.message
				);
			}
		};

		fetchOrders();
	}, [selectedStatus, router]);

	const handleStatusChange = (e) => {
		setSelectedStatus(e.target.value); // Update selectedStatus when dropdown value changes
	};

	const handleEditService = (serviceId) => {
		router.push(`/services/edit/${serviceId}`); // Navigate to edit page
	};

	const handleLogout = () => {
		Cookies.remove("adminAccessToken");
		Cookies.remove("adminRefreshToken");
		router.push("/"); // Redirect to login page after logout
	};

	return (
		<>
			<section className="bg-white py-8 antialiased md:py-16">
				<div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
					<div className="mx-auto max-w-screen-6xl">
						<div className="gap-4 sm:flex sm:items-center sm:justify-between">
							<h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
								All Orders
							</h2>
							<div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
								<div>
									<label
										htmlFor="order-type"
										className="sr-only mb-2 block text-sm font-medium text-gray-900"
									>
										Select order type
									</label>
									<select
										id="order-type"
										value={selectedStatus}
										onChange={handleStatusChange} // Handle status change
										className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
									>
										<option value="">All orders</option>
										<option value="pending">pending</option>
										<option value="payment done">payment done</option>
										<option value="document uploaded">document uploaded</option>
										<option value="order delivered">order delivered</option>
									</select>
								</div>
							</div>
						</div>

						<div className="mt-6 flow-root sm:mt-8">
							<div className="divide-y divide-gray-200">
								{orders.length > 0 ? (
									orders.map((order) => (
										<div
											key={order.id}
											className="flex flex-wrap items-center gap-y-4 py-6"
										>
											<dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
												<dt className="text-base font-medium text-gray-500 ">
													Order Id :
												</dt>
												<dd className="mt-1.5 text-base font-semibold text-gray-900 ">
													<a
														href={`orders/details/${order.id}`}
														className="hover:underline"
													>
														#...{order.id.slice(24)}
													</a>
												</dd>
											</dl>
											<dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
												<dt className="text-base font-medium text-gray-500 ">
													Service Name:
												</dt>
												<dd className="mt-1.5 text-base font-semibold text-gray-900 ">
													<a
														href={`orders/details/${order.id}`}
														className="hover:underline"
													>
														{order.service.name}
													</a>
												</dd>
											</dl>

											<dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
												<dt className="text-base font-medium text-gray-500 ">
													Date:
												</dt>
												<dd className="mt-1.5 text-sm font-semibold text-gray-900  ">
													{new Date(order.order_date).toLocaleString("en-US", {
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
														second: "2-digit",
														hour12: false,
													})}
												</dd>
											</dl>

											<dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
												<dt className="text-base font-medium text-gray-500 ">
													Price:
												</dt>
												<dd className="mt-1.5 text-base font-semibold text-gray-900 ">
													₹{order.service.price}
												</dd>
											</dl>

											<dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
												<dt className="text-base font-medium text-gray-500 ">
													Status:
												</dt>
												<dd
													className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
														order.order_status === "pending"
															? "bg-red-200 text-red-800 "
															: order.order_status === "payment done"
															? "bg-green-200 text-green-800 "
															: order.order_status === "order delivered"
															? "bg-blue-200 text-blue-800 "
															: order.order_status === "document uploaded"
															? "bg-purple-200 text-purple-800 "
															: "bg-gray-200 text-gray-800 "
													}`}
												>
													{order.order_status === "pending"
														? "Failed"
														: order.order_status}
												</dd>
											</dl>

											<div className="grid sm:grid-cols-2 lg:flex lg:w-fit lg:items-center lg:justify-end gap-4">
												<Link
													href={`orders/details/${order.id}`}
													className="w-full inline-flex justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100   lg:w-auto"
												>
													View details
												</Link>
												{/* ) : (
												<Link
													href={`/orders/form_fillup/${order.id}`}
													className="w-full inline-flex justify-center rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100   lg:w-auto"
												>
													Fill the Form
												</Link>
											)} */}
											</div>
										</div>
									))
								) : (
									<p className="text-center text-gray-500 py-6">
										No orders found
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
