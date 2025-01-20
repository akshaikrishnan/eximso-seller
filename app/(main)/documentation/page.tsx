import React from 'react';

const EximsoDocumentation = () => {
    return (
        <div className="bg-white min-h-screen py-5">
            <div className="max-w-4xl mx-auto">
                {/* Welcome to Eximso Section */}
                <div className="bg-white shadow-lg rounded-lg p-4 mb-1">
                    <h1 className="text-4xl font-bold text-gray-800 bg-gray-200 mb-4 p-2 rounded-lg">
                        Welcome to Eximso
                    </h1>
                    <p className="text-gray-600 text-lg">
                        This documentation provides guidance on using the Eximso platform, including the Add Product, Product Listing, Profile Editing, and Dashboard modules.
                    </p>
                </div>

                {/* Other Sections */}
                <div className="bg-white shadow-lg rounded-lg ml-6">
                    <div className="space-y-6">

                        {/* Add Product Module */}
                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 bg-gray-200 mb-3 p-2 rounded-lg">
                                Add Product Module
                            </h2>
                            <p className="text-gray-600 mb-2 text-justify">
                                The Add Product module allows you to introduce new items into your catalog. Here’s how to get started:
                            </p>
                            <ol className="list-decimal list-inside text-gray-600 space-y-1">
                                <li>Navigate to the 'Add Product' section in your dashboard.</li>
                                <li>Fill in the product details, including name, description, pricing, and images.</li>
                                <li>Submit the form to add the product to your listing.</li>
                            </ol>
                        </div>

                        {/* Product Listing Module */}
                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 bg-gray-200 mb-3 p-2 rounded-lg">
                                Product Listing Module
                            </h2>
                            <p className="text-gray-600 text-justify">
                                The Product Listing module displays all your products. You can manage your inventory, update product details, and remove items as needed.
                            </p>
                        </div>

                        {/* Profile Editing Module */}
                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 bg-gray-200 mb-3 p-2 rounded-lg">
                                Profile Editing Module
                            </h2>
                            <p className="text-gray-600 text-justify">
                                Update your business information through the Profile Editing module. Ensure your contact details and descriptions are up-to-date.
                            </p>
                        </div>

                        {/* Dashboard Overview */}
                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 bg-gray-200 mb-3 p-2 rounded-lg">
                                Dashboard Overview
                            </h2>
                            <p className="text-gray-600 text-justify">
                                The Dashboard provides a snapshot of your business activity. It includes:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                                <li>Recent Sales: A summary of your latest transactions.</li>
                                <li>Top Sales: Insights into your best-selling products.</li>
                                <li>Top Performing Products: Analytics on products with the highest performance metrics.</li>
                            </ul>
                        </div>

                        {/* Contact Information */}
                        <div className="p-3 bg-gray-50 border rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-700 bg-gray-200 mb-3 p-2 rounded-lg">
                                Contact Information
                            </h2>
                            <p className="text-gray-600 text-justify">
                                For support or inquiries, reach out to us at:
                            </p>
                            <ul className="text-gray-600 mt-2 space-y-1">
                                <li>
                                    <b>Email:</b>{' '}
                                    <a
                                        href="mailto:help@eximso.com"
                                        className="text-primary hover:underline"
                                    >
                                        help@eximso.com
                                    </a>
                                </li>
                                <li>
                                    <b>Phone:</b> [Insert Phone Number]
                                </li>
                                <li>
                                    <b>Website:</b>{' '}
                                    <a
                                        href="https://www.eximso.com"
                                        className="text-primary hover:underline"
                                    >
                                        www.eximso.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EximsoDocumentation;
