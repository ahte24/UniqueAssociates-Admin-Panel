"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import endpoint from "@/utils/endpoint";
import "react-toastify/dist/ReactToastify.css";
import { CircleChevronRight } from "lucide-react";
import Loader from "@/components/Loader";

export default function ServiceForm({
	categories,
	initialData,
	addService,
	isEditMode = false,
}) {
	const [serviceName, setServiceName] = useState("");
	const [serviceDescription, setServiceDescription] = useState("");
	const [servicePrice, setServicePrice] = useState(0);
	const [sections, setSections] = useState([{ heading: "", points: [] }]);
	const [newPoints, setNewPoints] = useState([""]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [category, setCategory] = useState([]);
	const [numberOfDocuments, setNumberOfDocuments] = useState(0);
	const [documentNames, setDocumentNames] = useState([""]);
	const [numberOfServiceDescriptions, setNumberOfServiceDescriptions] =
		useState(1);
	const [coverImage, setCoverImage] = useState(null);
	const [image, setImage] = useState(null);
	const [mostVisited, setMostVisited] = useState(false);
	console.log(mostVisited);

	useEffect(() => {
		if (initialData) {
			setServiceName(initialData.serviceName);
			setServiceDescription(initialData.serviceDescription);
			setServicePrice(initialData.servicePrice || 0);
			setSelectedCategory(initialData.category);
			setSections(initialData.sections || [{ heading: "", points: [] }]);
			setNewPoints(initialData.sections?.map(() => "") || [""]);
			setNumberOfDocuments(initialData.numberOfDocuments || 0);
			setDocumentNames(initialData.documentNames || [""]);
			setNumberOfServiceDescriptions(
				initialData.numberOfServiceDescriptions || 1
			);
			setCoverImage(initialData.coverImage || null);
			setImage(initialData.image || null);
			setMostVisited(initialData.mostVisited || false);
		}
	}, [initialData]);

	const handleSectionChange = (index, field, value) => {
		const newSections = sections.map((section, i) =>
			i === index ? { ...section, [field]: value } : section
		);
		setSections(newSections);
	};

	const handleAddPoint = (index) => {
		const point = newPoints[index];
		if (point && sections[index].points.length < 6) {
			const newSections = sections.map((section, i) =>
				i === index
					? { ...section, points: [...section.points, point] }
					: section
			);
			const updatedNewPoints = newPoints.map((p, i) => (i === index ? "" : p));
			setSections(newSections);
			setNewPoints(updatedNewPoints);
		}
	};

	const handleNewPointChange = (index, value) => {
		const updatedNewPoints = newPoints.map((point, i) =>
			i === index ? value : point
		);
		setNewPoints(updatedNewPoints);
	};

	const handleRemovePoint = (sectionIndex, pointIndex) => {
		const newSections = sections.map((section, i) => {
			if (i === sectionIndex) {
				const updatedPoints = section.points.filter(
					(_, idx) => idx !== pointIndex
				);
				return { ...section, points: updatedPoints };
			}
			return section;
		});
		setSections(newSections);
	};

	// Handle document names change
	const handleDocumentNameChange = (index, value) => {
		const updatedDocumentNames = [...documentNames];
		updatedDocumentNames[index] = value;
		setDocumentNames(updatedDocumentNames);
	};

	// Update the number of document input fields
	const handleNumberOfDocumentsChange = (value) => {
		const numDocs = parseInt(value, 10);
		setNumberOfDocuments(isNaN(numDocs) ? 0 : numDocs);

		if (numDocs > documentNames.length) {
			setDocumentNames([
				...documentNames,
				...Array(numDocs - documentNames.length).fill(""),
			]);
		} else {
			setDocumentNames(documentNames.slice(0, numDocs));
		}
	};

	// Update the number of service description sections
	const handleNumberOfServiceDescriptionsChange = (value) => {
		const numDesc = parseInt(value, 10);
		setNumberOfServiceDescriptions(isNaN(numDesc) ? 1 : numDesc);

		if (numDesc > sections.length) {
			const additionalSections = Array(numDesc - sections.length).fill({
				heading: "",
				points: [],
			});
			setSections([...sections, ...additionalSections]);
			setNewPoints([
				...newPoints,
				...Array(numDesc - newPoints.length).fill(""),
			]);
		} else {
			setSections(sections.slice(0, numDesc));
			setNewPoints(newPoints.slice(0, numDesc));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!serviceName ||
			!serviceDescription ||
			isNaN(servicePrice) ||
			!selectedCategory
		) {
			alert("Please fill in all required fields.");
			return;
		}

		const formData = new FormData();
		formData.append("name", serviceName);
		formData.append("short_description", serviceDescription);
		formData.append("price", servicePrice);
		formData.append("category_id", selectedCategory);
		formData.append("most_visited", mostVisited);
		if (coverImage) {
			formData.append("cover_image", coverImage);
		}
		if (image) {
			formData.append("image", image);
		}
		formData.append(
			"number_of_service_description",
			numberOfServiceDescriptions
		);

		sections.forEach((section, index) => {
			formData.append(`heading${index + 1}`, section.heading || "");
			formData.append(`point1${index + 1}`, section.points[0] || "");
			formData.append(`point2${index + 1}`, section.points[1] || "");
			formData.append(`point3${index + 1}`, section.points[2] || "");
			formData.append(`point4${index + 1}`, section.points[3] || "");
			formData.append(`point5${index + 1}`, section.points[4] || "");
			formData.append(`point6${index + 1}`, section.points[5] || "");
		});

		formData.append("number_of_document_needed", numberOfDocuments);
		documentNames.forEach((docName, index) => {
			formData.append(`document_name${index + 1}`, docName);
		});

		try {
			// Retrieve the authentication adminAccessToken from cookies
			const adminAccessToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("adminAccessToken="))
				.split("=")[1];

			// Make the POST request to add the service
			const response = await axios.post(
				`${endpoint}/service/add_service/`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${adminAccessToken}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			toast.success("Service added successfully.", {
				position: "top-right",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});
			console.log("Service added successfully:", response.data);

			// Reset form fields after submission if needed
			setServiceName("");
			setServiceDescription("");
			setServicePrice(0);
			setSections([{ heading: "", points: [] }]);
			setNewPoints([""]);
			setSelectedCategory("");
			setNumberOfDocuments(0);
			setDocumentNames([""]);
			setNumberOfServiceDescriptions(1);
			setCoverImage(null);
			setImage(null);
			setMostVisited(false);

			if (typeof addService === "function") {
				addService({
					id: initialData?.id || Date.now(),
					serviceName,
					serviceDescription,
					servicePrice,
					sections: sections.map((section) => ({
						...section,
						points: section.points || [],
					})),
					category: selectedCategory,
				});
			} else {
				console.error("addService is not a function", { addService });
			}
		} catch (error) {
			console.error(
				"Error adding service:",
				error.response?.data || error.message
			);
			toast.error("Error adding service.", {
				position: "top-right",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get(`${endpoint}/service/category/`);
				setCategory(response.data);
			} catch (error) {
				console.error("Error fetching categories:", error.message);
			}
		};

		fetchCategories();
	}, []);

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				transition={Bounce}
			/>
			<motion.div
				className="w-[70%] mx-auto bg-white rounded-lg shadow-md p-6 mt-8"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Category</label>
						<select
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							required
						>
							<option value="" disabled>
								Select Category
							</option>
							{category.map((category, index) => (
								<option key={index} value={category.id}>
									{category.category_name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Service Name</label>
						<input
							type="text"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={serviceName}
							onChange={(e) => setServiceName(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">
							Service Description
						</label>
						<textarea
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={serviceDescription}
							onChange={(e) => setServiceDescription(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Service Price</label>
						<input
							type="number"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={servicePrice === 0 ? "" : servicePrice}
							onChange={(e) => setServicePrice(parseFloat(e.target.value) || 0)}
							required
						/>
					</div>

					{/* Most Visited Checkbox */}
					<div className="mb-4">
						<label className="inline-flex items-center">
							<input
								type="checkbox"
								className="form-checkbox border-2 border-gray-400 text-blue-600"
								checked={mostVisited}
								onChange={(e) => setMostVisited(e.target.checked)}
							/>
							<span className="ml-2 text-gray-700">Most Visited</span>
						</label>
					</div>

					{/* Cover Image Upload */}
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Cover Image</label>
						<input
							type="file"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							onChange={(e) => setCoverImage(e.target.files[0])}
						/>
					</div>

					{/* Image Upload */}
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Image</label>
						<input
							type="file"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>

					{/* Number of Service Descriptions */}
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">
							Number of Service Descriptions
						</label>
						<input
							type="number"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={
								numberOfServiceDescriptions === 0
									? ""
									: numberOfServiceDescriptions
							}
							onChange={(e) =>
								handleNumberOfServiceDescriptionsChange(e.target.value)
							}
							min="0"
							required
						/>
					</div>

					{sections.map((section, index) => (
						<motion.div
							key={index}
							className="mb-6 border-2 p-4 rounded-xl border-gray-300 pt-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: index * 0.2 }}
						>
							<div className="flex justify-between items-center mb-2">
								<h3 className="text-lg font-bold text-gray-900">
									Section {index + 1}
								</h3>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700 mb-2">Heading</label>
								<input
									type="text"
									className="w-full  px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
									value={section.heading}
									onChange={(e) =>
										handleSectionChange(index, "heading", e.target.value)
									}
									required
								/>
							</div>
							<div className="mb-4">
								<label className="block text-gray-700 mb-2">Points</label>
								<div className="flex flex-col sm:flex-row items-center mb-2">
									<input
										type="text"
										className="flex-grow w-full sm:w-auto px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 mb-2 sm:mb-0 sm:mr-2"
										value={newPoints[index]}
										onChange={(e) =>
											handleNewPointChange(index, e.target.value)
										}
									/>
									<button
										type="button"
										className={`px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto ${
											sections[index].points.length >= 6
												? "bg-gray-400 cursor-not-allowed"
												: "bg-green-500 text-white hover:bg-green-600"
										}`}
										onClick={() => handleAddPoint(index)}
										disabled={sections[index].points.length >= 6}
									>
										Add Point
									</button>
								</div>
								<ul className="mt-2 list-disc pl-6">
									{section.points.map((point, pointIndex) => (
										<li
											key={pointIndex}
											className="text-gray-600 flex justify-between items-center"
										>
											{point}
											<button
												type="button"
												className="text-red-500 hover:text-red-700 ml-4"
												onClick={() => handleRemovePoint(index, pointIndex)}
											>
												Remove
											</button>
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					))}

					{/* Number of Documents Needed */}
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">
							Number of Documents Needed
						</label>
						<input
							type="number"
							className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
							value={numberOfDocuments === 0 ? "" : numberOfDocuments}
							onChange={(e) => handleNumberOfDocumentsChange(e.target.value)}
							min="0"
							required
						/>
					</div>

					{/* Document Names Inputs */}
					{Array.from({ length: numberOfDocuments }).map((_, index) => (
						<div key={index} className="mb-4">
							<label className="block text-gray-700 mb-2">
								Document Name {index + 1}
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
								value={documentNames[index] || ""}
								onChange={(e) =>
									handleDocumentNameChange(index, e.target.value)
								}
								required
							/>
						</div>
					))}

					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
					>
						{isEditMode ? "Update Service" : "Add Service"}
					</button>
				</form>
			</motion.div>
		</>
	);
}
