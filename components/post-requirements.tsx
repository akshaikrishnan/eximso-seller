'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
// import { IPostRequirement } from '@/lib/types/product';
import { IPostRequirement } from '@/lib/post-requirements/model';
import Link from 'next/link';
import isRecent from '@/lib/utils/isRecent';

const PostRequiremntsView = ({
    requirements: dataViewValue
}: {
    requirements: IPostRequirement[];
}) => {
    // const [dataViewValue, setDataViewValue] = useState<IPostRequirement[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<
        IPostRequirement[] | null | undefined
    >(null);
    const [layout, setLayout] = useState<
        'grid' | 'list' | (string & Record<string, unknown>)
    >('list');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');

    const toast = React.useRef<Toast>(null);
    const sortOptions = [
        { label: 'Latest First', value: '!updatedAt' },
        { label: 'Oldest First', value: 'updatedAt' }
    ];

    // useEffect(() => {
    //     IPostRequirementService.getIPostRequirements().then((data) => setDataViewValue(data));
    //     setGlobalFilterValue('');
    // }, []);

    const formatDateToReadable = (dateStr: string): string => {
        const date = new Date(dateStr);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((product) => {
                const productNameLowercase = product.name.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown
                value={sortKey}
                options={sortOptions}
                optionLabel="label"
                placeholder="Sort By Date"
                onChange={onSortChange}
            />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    onChange={onFilter}
                    placeholder="Search by Name"
                />
            </span>
        </div>
    );

    const dataviewListItem = (data: IPostRequirement) => {
        return (
            <div className="col-12">
                <Toast ref={toast} />
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <div>
                        <img
                            src={`${data.image}`}
                            alt={data.name}
                            className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
                        />
                    </div>
                    <div className="flex-1 flex flex-column align-items-start md:text-left">
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data?.specifications}</div>

                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data?.category?.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        {/* <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
                            ${data.}
                        </span> */}

                        {data?.updatedAt && (
                            <span
                                className={`product-badge status-${
                                    isRecent(data?.updatedAt) ? 'instock' : 'lowStock'
                                }`}
                            >
                                {formatDateToReadable(data?.updatedAt)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data: IPostRequirement) => {
        if (!data) {
            return;
        }

        return dataviewListItem(data);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Post Requirements</h5>
                    <DataView
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}
                        emptyMessage="No Post Requirements found."
                    ></DataView>
                </div>
            </div>
        </div>
    );
};

export default PostRequiremntsView;
