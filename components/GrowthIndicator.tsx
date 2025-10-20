import React from 'react';

/**
 * Renders a simple up/down/no-change indicator with color, icon, and text.
 *
 * @param label - e.g. "orders" or "revenue"
 * @param delta - absolute change (positive or negative)
 * @param deltaPercent - percentage change (positive, negative, or 0)
 * @param sinceLabel - optional phrase like "since last week"
 */
export function GrowthIndicator({
    label = 'orders',
    delta = 0,
    deltaPercent = 0,
    sinceLabel = 'since last week'
}: {
    label?: string;
    delta?: number;
    deltaPercent?: number;
    sinceLabel?: string;
}) {
    let color = 'text-gray-500';
    let icon = 'pi pi-arrow-right';
    let text = `No change in ${label}`;

    if (delta > 0) {
        color = 'text-green-500';
        icon = 'pi pi-arrow-up';
        text = `${Math.abs(deltaPercent)}% more ${label}`;
    } else if (delta < 0) {
        color = 'text-red-500';
        icon = 'pi pi-arrow-down';
        text = `${Math.abs(deltaPercent)}% fewer ${label}`;
    }

    return (
        <div className="flex align-items-center mt-2">
            <i className={`${icon} ${color} mr-2`} />
            <span className={`${color} font-medium`}>
                {delta > 0 ? `+${delta}` : delta}
            </span>
            <span className="text-500 ml-2">
                {text} {sinceLabel ? ` ${sinceLabel}` : ''}
            </span>
        </div>
    );
}
