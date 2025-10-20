import React, { useContext, useEffect, useState } from 'react';
import { useSalesChart } from '@/lib/hooks/useSalesChart';
import { Chart } from 'primereact/chart';
import { ChartOptions } from 'chart.js';
import { LayoutContext } from '@/layout/context/layoutcontext';

const palette = [
    '#2f4860',
    '#00bb7e',
    '#ff6b6b',
    '#22c55e',
    '#8b5cf6',
    '#14b8a6',
    '#f59e0b'
];

export default function SalesChart() {
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const { data, isLoading, isError, error } = useSalesChart({
        months: 6, // or from state
        products: 5, // or from state
        metric: 'quantity', // or "revenue"
        statuses: 'Paid,Shipped,Completed'
        // productIds: "id1,id2"   // optional
    });
    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);
    if (isLoading) return <div>Loading chart…</div>;
    if (isError) return <div>Error: {error.message}</div>;
    const series = data?.result;
    const lineData = {
        labels: series?.labels ?? [],
        datasets: (series?.datasets ?? []).map((d, i) => ({
            label: d.label,
            data: d.data,
            fill: false,
            backgroundColor: palette[i % palette.length],
            borderColor: palette[i % palette.length],
            tension: 0.4
        }))
    };

    return (
        <div className="card">
            <h5>Sales Overview</h5>
            <Chart type="line" data={lineData} options={lineOptions} />
        </div>
    );
}
