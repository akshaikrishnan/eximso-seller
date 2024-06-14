import React from 'react';

const EximsoDocumentation = () => {
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card docs">
                        <h4>Welcome to Eximso</h4>
                        <p>
                            This documentation provides guidance on using the Eximso
                            platform, including the Add Product, Product Listing, Profile
                            Editing, and Dashboard modules.
                        </p>

                        <h5>Add Product Module</h5>
                        <p>
                            The Add Product module allows you to introduce new items into
                            your catalog. Here&lsquo;s how to get started:
                            <ol>
                                <li>
                                    Navigate to the &apos;Add Product&apos; section in
                                    your dashboard.
                                </li>
                                <li>
                                    Fill in the product details, including name,
                                    description, pricing, and images.
                                </li>
                                <li>
                                    Submit the form to add the product to your listing.
                                </li>
                            </ol>
                        </p>

                        <h5>Product Listing Module</h5>
                        <p>
                            The Product Listing module displays all your products. You can
                            manage your inventory, update product details, and remove
                            items as needed.
                        </p>

                        <h5>Profile Editing Module</h5>
                        <p>
                            Update your business information through the Profile Editing
                            module. Ensure your contact details and descriptions are
                            up-to-date.
                        </p>

                        <h5>Dashboard Overview</h5>
                        <p>
                            The Dashboard provides a snapshot of your business activity.
                            It includes:
                            <ul>
                                <li>
                                    Recent Sales: A summary of your latest transactions.
                                </li>
                                <li>
                                    Top Sales: Insights into your best-selling products.
                                </li>
                                <li>
                                    Top Performing Products: Analytics on products with
                                    the highest performance metrics.
                                </li>
                            </ul>
                        </p>

                        <h5>Contact Information</h5>
                        <p>
                            For support or inquiries, reach out to us at:
                            <ul>
                                <li>
                                    Email: <b>help@eximso.com</b>
                                </li>
                                <li>Phone: [Insert Phone Number]</li>
                                <li>
                                    Website:{' '}
                                    <a
                                        href="https://www.eximso.com"
                                        className="font-medium hover:underline text-primary"
                                    >
                                        www.eximso.com
                                    </a>
                                </li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EximsoDocumentation;
