'use client';
import { Fragment } from 'react';
import { useNotification } from '@/lib/hooks/useNotifications';
import Empty from '@/components/empty-state';
export default function Notifications() {
    const { groupedData: notifications, isLoading, error, refetch } = useNotification();
    console.log(notifications);

    const icons: { [key: string]: string } = {
        orders: 'pi pi-shopping-cart',
        'order-placed': 'pi pi-shopping-cart',
        payments: 'pi pi-wallet',
        reviews: 'pi pi-star',
        messages: 'pi pi-comment',
        system: 'pi pi-cog',
        promotions: 'pi pi-tag',
        shipping: 'pi pi-truck',
        returns: 'pi pi-refresh',
        other: 'pi pi-info-circle'
    };
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifications</h5>
                    </div>
                    {isLoading && <p className="text-center text-gray-500">Loading...</p>}
                    {!isLoading && Object.keys(notifications || {}).length === 0 && (
                        <Empty title="No new notifications!" icon="empty" />
                    )}

                    {Object.keys(notifications || {}).map((date) => (
                        <Fragment key={date}>
                            <span className="block text-600 font-medium mb-3 uppercase">
                                {date}
                            </span>
                            {/* also should valid for notifications = {} */}
                            {notifications[date].length === 0 && (
                                <p className="text-center text-gray-500">
                                    No notifications
                                </p>
                            )}
                            {notifications[date].length > 0 && (
                                <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                                    {notifications[date].map(
                                        (notification: any, index: number) => (
                                            <Fragment key={index}>
                                                <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                                    <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                                        <i
                                                            className={
                                                                icons[
                                                                    notification.type
                                                                ] || 'pi pi-info-circle'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="text-900 line-height-3">
                                                        {notification.title}
                                                        <div className="text-700 text-sm">
                                                            {notification.body}
                                                        </div>
                                                    </div>
                                                </li>
                                            </Fragment>
                                        )
                                    )}
                                </ul>
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
