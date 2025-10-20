'use client';
import Empty from '@/components/empty-state';
import { useBestSelling } from '@/lib/hooks/useBestSelling';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import React, { useRef } from 'react';

const colorBar = [
    'bg-orange-500 text-orange-500',
    'bg-cyan-500 text-cyan-500',
    'bg-pink-500 text-pink-500',
    'bg-green-500 text-green-500',
    'bg-purple-500 text-purple-500',
    'bg-teal-500 text-teal-500'
];

export default function BestSelling({
    metric = 'revenue',
    limit = 6,
    startDate,
    endDate,
    statuses = 'Paid,Shipped,Completed'
}: {
    metric?: 'revenue' | 'quantity';
    limit?: number;
    startDate?: string;
    endDate?: string;
    statuses?: string;
}) {
    const menu1 = useRef<Menu>(null);
    const { data, isLoading, isError, error } = useBestSelling({
        metric,
        limit,
        startDate,
        endDate,
        statuses
    });

    if (isLoading) return <div>Loading best sellers…</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const items = data?.result ?? [];
    const meta = data?.meta;
    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-5">
                <h5>Best Selling Products</h5>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-ellipsis-v"
                        rounded
                        text
                        className="p-button-plain"
                        onClick={(event) => menu1.current?.toggle(event)}
                    />
                    <Menu
                        ref={menu1}
                        popup
                        model={[
                            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                        ]}
                    />
                </div>
            </div>
            {!isLoading && items.length === 0 && <Empty icon="cart" />}
            <ul className="list-none p-0 m-0">
                {items.map((item, idx) => {
                    const color = colorBar[idx % colorBar.length];
                    const [bar, text] = color.split(' ');
                    const pct = Math.max(0, Math.min(100, item.percentage || 0));

                    return (
                        <li
                            key={item.productId}
                            className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
                        >
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                    {item.productName}
                                </span>
                                <div className="mt-1 text-600">
                                    {item.categoryName ?? 'Uncategorized'}
                                </div>
                            </div>

                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <div
                                    className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                    style={{ height: '8px' }}
                                >
                                    <div
                                        className={`${bar} h-full`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className={`${text} ml-3 font-medium`}>%{pct}</span>
                            </div>
                        </li>
                    );
                })}
                {meta && (
                    <div className="mt-2 text-xs text-600">
                        Metric: {meta.metric} · Total Revenue:{' '}
                        {meta.totalRevenue?.toLocaleString?.('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                        })}{' '}
                        · Total Qty: {meta.totalQty?.toLocaleString?.()}
                    </div>
                )}
            </ul>
        </div>
    );
}
