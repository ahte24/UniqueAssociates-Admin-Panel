// components/ServiceList.js

export default function ServiceList({ services }) {
	return (
		<div className="p-4 bg-white shadow rounded-lg mt-8">
			<h2 className="text-xl font-bold mb-4">Services List</h2>
			{services.length === 0 ? (
				<p className="text-gray-600">No services available.</p>
			) : (
				<ul>
					{services.map((service, index) => (
						<li
							key={index}
							className="mb-4 p-4 border border-gray-300 rounded-md"
						>
							<h3 className="text-lg font-bold">{service.serviceName}</h3>
							<p>
								<strong>Category:</strong> {service.category}
							</p>
							<p>
								<strong>Description:</strong> {service.serviceDescription}
							</p>
							<p>
								<strong>Price:</strong> ₹{service.servicePrice}
							</p>
							{service.sections &&
								service.sections.map((section, secIndex) => (
									<div key={secIndex} className="mt-4">
										<p>
											<strong>Section {secIndex + 1}</strong>
										</p>
										<p>
											<strong>Heading:</strong> {section.heading}
										</p>
										<p>
											<strong>Subheading:</strong> {section.subHeading}
										</p>
										<ul>
											<strong>Points:</strong>
											{section.points && section.points.length > 0 ? (
												section.points.map((point, idx) => (
													<li key={idx} className="text-gray-600">
														- {point}
													</li>
												))
											) : (
												<li className="text-gray-600">No points available.</li>
											)}
										</ul>
									</div>
								))}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
