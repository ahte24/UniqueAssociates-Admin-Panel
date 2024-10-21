"use client";

// import { headers } from "next/headers";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import endpoint from "@/utils/endpoint";
import Loader from "@/components/Loader";

export default function Component({ params }) {
	const token = Cookies.get("adminAccessToken");
	const [error, setError] = useState(false);
	const [orderData, setOrderData] = useState(null);
	const { id } = params;

	useEffect(() => {
		const orderDetails = async () => {
			try {
				const response = await axios.get(
					`${endpoint}/order/order_detail/${id}/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setOrderData(response.data);
			} catch (error) {
				setError(error);
				console.log(error);
			}
		};

		orderDetails();
	}, []);
	console.log(orderData);

	return (
		<div className="flex flex-col lg:flex-row gap-6 md:p-8 font-sans container mx-auto ">
			{orderData ? (
				<>
					<div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
						<div className="p-6">
							<h2 className="text-2xl font-semibold mb-4">Order Details</h2>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm text-gray-500">Order ID</p>
										<p className="font-medium">{orderData.id}</p>
									</div>
									<span
										className={`me-2 mt-1.5  items-center text-center rounded px-2.5 py-0.5 text-xs font-medium ${
											orderData.order_status === "pending"
												? "bg-red-200 text-red-800 "
												: orderData.order_status === "payment done"
												? "bg-green-200 text-green-800 "
												: orderData.order_status === "order delivered"
												? "bg-blue-200 text-blue-800 "
												: orderData.order_status === "document uploaded"
												? "bg-purple-200 text-purple-800 "
												: "bg-gray-200 text-gray-800 "
										}`}
									>
										{orderData.order_status === "pending"
											? "Failed"
											: orderData.order_status}
									</span>
								</div>
								<div>
									<p className="text-sm text-gray-500 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-4 h-4"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
											/>
										</svg>
										Service Name
									</p>
									<p className="font-medium">{orderData.service.name}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-4 h-4"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Price
									</p>
									<p className="font-medium">₹{orderData.service.price}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-4 h-4"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
											/>
										</svg>
										Order Date
									</p>
									<p className="font-medium">
										{new Date(orderData.order_date).toLocaleString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
											hour12: false,
										})}
									</p>
								</div>
								<div className="bg-white shadow-md rounded-lg p-2">
									<h2 className="text-xl font-semibold mb-4">
										Submitted Details
									</h2>
									{orderData.order_status === "pending" ? (
										<p className="text-sm text-gray-500">
											Payment was not Successful
										</p>
									) : (
										<>
											<div>
												{orderData.order_docs.length > 0 ? (
													<div className="space-y-4">
														<div>
															<label
																htmlFor="name"
																className="block text-sm font-medium text-gray-700"
															>
																Name
															</label>
															<span className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
																{orderData.order_docs[0].customer_name}
															</span>
														</div>
														<div>
															<label
																htmlFor="businessType"
																className="block text-sm font-medium text-gray-700"
															>
																Business Type
															</label>
															<span className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
																{!orderData.order_docs[0].business_type
																	? "Fetching Please Wait..."
																	: orderData.order_docs[0].business_type}
															</span>
														</div>
														<div>
															<label
																htmlFor="state"
																className="block text-sm font-medium text-gray-700"
															>
																State
															</label>
															<span className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
																{orderData.order_docs[0].state}
															</span>
														</div>
														<div>
															<label
																htmlFor="gstPan"
																className="block text-sm font-medium text-gray-700"
															>
																GST/PAN
															</label>
															<span className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
																{orderData.order_docs[0].pan_gstin.toUpperCase()}
															</span>
														</div>
														<div>
															<label
																htmlFor="pincode"
																className="block text-sm font-medium text-gray-700"
															>
																Pincode
															</label>
															<span className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
																{orderData.order_docs[0].pincode}
															</span>
														</div>
													</div>
												) : (
													<p className="text-sm text-gray-500">
														The user has not filled up the form yet.
													</p>
												)}
											</div>
											<div className="space-y-6 mt-6">
												<div className="bg-white rounded-lg shadow-md overflow-hidden">
													<div className="bg-white shadow-md rounded-lg p-2">
														<h2 className="text-xl font-semibold mb-4">
															Documents
														</h2>
														{orderData.order_docs.length > 0 ? (
															<table className="min-w-full mx-auto divide-y divide-gray-200">
																<thead className="bg-gray-50">
																	<tr>
																		<th
																			scope="col"
																			className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																		>
																			Document Name
																		</th>
																		<th
																			scope="col"
																			className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																		>
																			Type
																		</th>
																		<th
																			scope="col"
																			className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																		>
																			Action
																		</th>
																	</tr>
																</thead>
																<tbody className="bg-white divide-y divide-gray-200">
																	{orderData.order_docs.map((doc) => (
																		<tr key={doc.id}>
																			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
																				{doc.document_name}
																			</td>
																			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
																				.pdf
																			</td>
																			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
																				<Link
																					href={`${endpoint}media/docs/ahteshamzaman026gmailcom/a655cf4f-3c5a-43d1-b4a4-1ecae06bcfd5/voter-id-ahteshamzama_PJLlxyt.pdf`}
																					className="text-indigo-600 hover:text-indigo-900 flex items-center"
																				>
																					<FileIcon className="w-4 h-4 mr-2" />
																					View
																				</Link>
																			</td>
																		</tr>
																	))}
																</tbody>
															</table>
														) : (
															<p className="text-sm text-gray-500">
																The user has not filled up the form yet.
															</p>
														)}
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="bg-white h-fit mx-auto lg:w-fit w-full  shadow-md rounded-lg p-6 md:col-span-2">
						<h2 className="text-2xl font-bold mb-4">Actions</h2>
						<div className="space-y-4 flex flex-col lg:w-[300px] ">
							<Link
								target="_blank"
								href={`http://wa.me/${
									orderData.customer.phone_number.startsWith("+91")
										? orderData.customer.phone_number
										: `+91${orderData.customer.phone_number}`
								}`}
								className="w-full text-center bg-[#215585] hover:bg-[#2a6dab] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Contact via Whatsapp
							</Link>
							<Link
								target="_blank"
								href={`tel:${
									orderData.customer.phone_number.startsWith("+91")
										? orderData.customer.phone_number
										: `+91${orderData.customer.phone_number}`
								}`}
								className="w-[100%] text-center bg-white hover:bg-gray-100 text-[#215585] font-semibold py-2 px-4 rounded border border-[#215585] focus:outline-none focus:shadow-outline"
							>
								Call Now
							</Link>
						</div>
					</div>
				</>
			) : (
				<Loader />
			)}
		</div>
	);
}
