/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { ChartData, ChartOptions } from 'chart.js';
import Empty from '@/components/empty-state';
import { currency } from '../config/constants/currency';
import { useRecentSales } from '@/lib/hooks/useRecentSales';
import BestSelling from '@/demo/components/BestSelling';
import SalesChart from '@/demo/components/SalesChart';
import { GrowthIndicator } from '@/components/GrowthIndicator';

const Dashboard = () => {
    const {
        data: sales,
        isLoading: salesLoading,
        isError: salesError,
        error: salesErrorData
    } = useRecentSales({
        page: 1,
        limit: 50,
        status: 'Paid,Shipped,Completed'
        // startDate: "2025-10-01",
        // endDate: "2025-10-17",
    });

    const menu2 = useRef<Menu>(null);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">
                                Orders
                            </span>
                            <div className="text-900 font-medium text-xl">
                                {sales?.meta?.totalDocs ?? 0}
                            </div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <GrowthIndicator
                        label="orders"
                        delta={sales?.meta?.ordersDelta ?? 0}
                        deltaPercent={sales?.meta?.ordersDeltaPercent ?? 0}
                        sinceLabel="compared to last week"
                    />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">
                                Revenue
                            </span>
                            <div className="text-900 font-medium text-xl">
                                {formatCurrency(sales?.meta?.totalSalesAmount ?? 0)}
                            </div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-orange-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <GrowthIndicator
                        label="revenue"
                        delta={sales?.meta?.revenueDelta ?? 0} // if you add revenue comparison later
                        deltaPercent={sales?.meta?.revenueDeltaPercent ?? 0} // same pattern
                        sinceLabel="compared to last week"
                    />
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">
                                Customers
                            </span>
                            <div className="text-900 font-medium text-xl">0</div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">newly registered</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">
                                Comments
                            </span>
                            <div className="text-900 font-medium text-xl">0 Unread</div>
                        </div>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">0 </span>
                    <span className="text-500">responded</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Sales</h5>
                    <DataTable
                        value={sales?.result}
                        rows={5}
                        paginator
                        responsiveLayout="scroll"
                        emptyMessage={<Empty />}
                    >
                        <Column
                            header="Image"
                            body={(data) => (
                                <img
                                    className="shadow-2"
                                    src={data.product.thumbnail}
                                    alt={data.product.name}
                                    width="50"
                                />
                            )}
                        />
                        <Column
                            field="product.name"
                            header="Name"
                            sortable
                            style={{ width: '35%' }}
                        />
                        <Column
                            field="salePrice"
                            header="Price"
                            sortable
                            style={{ width: '35%' }}
                            body={(data) => formatCurrency(data.salePrice)}
                        />
                        <Column
                            header="View"
                            style={{ width: '15%' }}
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" text />
                                </>
                            )}
                        />
                    </DataTable>
                </div>
                <BestSelling />
            </div>

            <div className="col-12 xl:col-6">
                <SalesChart />

                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                        <div>
                            <Button
                                type="button"
                                icon="pi pi-ellipsis-v"
                                rounded
                                text
                                className="p-button-plain"
                                onClick={(event) => menu2.current?.toggle(event)}
                            />
                            <Menu
                                ref={menu2}
                                popup
                                model={[
                                    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                ]}
                            />
                        </div>
                    </div>
                    <Empty title="No new messages!" icon="empty" />

                    {/* <span className="block text-600 font-medium mb-3">TODAY</span>
                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Richard Jones
                                <span className="text-700">
                                    {' '}
                                    has purchased a blue t-shirt for{' '}
                                    <span className="text-blue-500">79$</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-download text-xl text-orange-500" />
                            </div>
                            <span className="text-700 line-height-3">
                                Your request for withdrawal of{' '}
                                <span className="text-blue-500 font-medium">2500$</span>{' '}
                                has been initiated.
                            </span>
                        </li>
                    </ul>

                    <span className="block text-600 font-medium mb-3">YESTERDAY</span>
                    <ul className="p-0 m-0 list-none">
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-dollar text-xl text-blue-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Keyser Wick
                                <span className="text-700">
                                    {' '}
                                    has purchased a black jacket for{' '}
                                    <span className="text-blue-500">59$</span>
                                </span>
                            </span>
                        </li>
                        <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                            <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                <i className="pi pi-question text-xl text-pink-500" />
                            </div>
                            <span className="text-900 line-height-3">
                                Jane Davis
                                <span className="text-700">
                                    {' '}
                                    has posted a new questions about your product.
                                </span>
                            </span>
                        </li>
                    </ul> */}
                </div>
                <div
                    className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                    style={{
                        borderRadius: '1rem',
                        background:
                            'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)'
                    }}
                >
                    <div>
                        <div className="text-blue-100 font-medium text-xl mt-2 mb-3">
                            TAKE THE NEXT STEP
                        </div>
                        <div className="text-white font-medium text-5xl">Visit Store</div>
                    </div>
                    <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                        <Link
                            href="https://eximso.com"
                            target="_blank"
                            className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
