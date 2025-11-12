'use client';
import { currency } from '@/app/config/constants/currency';
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { ProductService } from '../../../../demo/service/ProductService';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Product } from '@/lib/types/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const ListDemo = () => {
    // const [dataViewValue, setDataViewValue] = useState<Product[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<Product[] | null | undefined>(
        null
    );
    const [layout, setLayout] = useState<
        'grid' | 'list' | (string & Record<string, unknown>)
    >('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState<Product>({} as Product);
    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    // useEffect(() => {
    //     ProductService.getProducts().then((data) => setDataViewValue(data));
    //     setGlobalFilterValue('');
    // }, []);

    const {
        data: dataViewValue,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return ProductService.getProducts().then((data) => {
                setGlobalFilterValue('');
                return data;
            });
        }
    });

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => {
            return ProductService.deleteProduct(product._id || '');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
            setDeleteProductDialog(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const getStockStatus = (stock: number, minimumOrderQuantity: number) => {
        if (stock <= 0) return 'outofstock';
        if (stock - minimumOrderQuantity >= minimumOrderQuantity * 3) {
            return 'instock';
        } else {
            return 'lowstock';
        }
    };
    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((product: any) => {
                const productNameLowercase = product.name.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProductDialogFooter = (
        <>
            <Button
                label="No"
                icon="pi pi-times"
                text
                onClick={hideDeleteProductDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                loading={deleteMutation.isPending}
                text
                onClick={() => deleteMutation.mutate()}
            />
        </>
    );
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
                placeholder="Sort By Price"
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
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
        </div>
    );

    const PriceDisplay = ({ data }: { data: Product }) => {
        return (
            <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
                {data.offerPrice && data.offerPrice > 0
                    ? `${currency}${data.offerPrice}`
                    : `${currency}${data.price}`}
            </span>
        );
    };

    const dataviewListItem = (data: Product) => {
        return (
            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <Link href={`/seller/manage-product/${data._id}`}>
                        <img
                            src={`${data.thumbnail}`}
                            alt={data.name}
                            className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
                        />
                    </Link>
                    <div
                        className="flex-1 flex flex-column align-items-center text-center md:text-left"
                        style={{ backgroundColor: 'white' }}
                    >
                        <div className="font-bold text-2xl">{data.name}</div>
                        <div className="mb-2">{data?.shortDescription}</div>
                        <Rating
                            value={data?.rating || 0}
                            readOnly
                            cancel={false}
                            className="mb-2"
                        ></Rating>
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="font-semibold">{data?.category?.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <PriceDisplay data={data} />
                        <div className="flex gap-2">
                            <Link href={`/seller/manage-product/${data._id}`}>
                                <Button
                                    label="Edit"
                                    icon="pi pi-pencil"
                                    severity="warning"
                                    size="small"
                                    className="mb-2"
                                />
                            </Link>
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                severity="danger"
                                onClick={() => confirmDeleteProduct(data)}
                                size="small"
                                className="mb-2"
                            />
                        </div>
                        {data.isApproved ? (
                            <span
                                className={`product-badge status-${getStockStatus(
                                    data?.stock,
                                    data?.minimumOrderQuantity
                                )}`}
                            >
                                {getStockStatus(data?.stock, data?.minimumOrderQuantity)}
                            </span>
                        ) : (
                            <span className="product-badge status-pendingapproval">
                                Pending Approval
                            </span>
                        )}

                        {/* <span
                        className={`product-badge status-${getStockStatus(
                            data?.stock,
                            data?.minimumOrderQuantity
                        )}`}
                    >
                        {getStockStatus(data?.stock, data?.minimumOrderQuantity)}
                    </span> */}
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: Product) => {
        return (
            <div className="col-12 lg:col-4 md:col-6">
                <div
                    className="card m-3 border-4 surface-border"
                    style={{
                        // width: '350px',
                        height: '440px',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }} // Set width and height here
                >
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-2" />
                            <span className="font-semibold">{data?.category?.name}</span>
                        </div>
                        {data.isApproved ? (
                            <span
                                className={`product-badge status-${getStockStatus(
                                    data?.stock,
                                    data?.minimumOrderQuantity
                                )}`}
                            >
                                {getStockStatus(data?.stock, data?.minimumOrderQuantity)}
                            </span>
                        ) : (
                            <span className="product-badge status-pendingapproval">
                                Pending Approval
                            </span>
                        )}
                    </div>
                    <div className="flex flex-column align-items-center text-center mb-3">
                        <Link href={`/seller/manage-product/${data._id}`}>
                            <img
                                src={`${data?.thumbnail}`}
                                alt={data.name}
                                className="object-cover w-full mb-4 h-60 sm:h-96 bg-gray-500 dark:bg-gray-500"
                                style={{
                                    maxHeight: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }} // Set max height for the image
                            />
                        </Link>
                        <div className="text-2xl font-bold mb-2">{data.name}</div>
                        <div
                            className="mb-3 w-full h-12 overflow-hidden text-ellipsis"
                            style={{ width: '100%', height: '52px' }}
                        >
                            {data?.shortDescription}
                        </div>
                        <Rating value={data?.rating || 0} readOnly cancel={false} />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <PriceDisplay data={data} />

                        <div className="flex gap-2">
                            <Link href={`/seller/manage-product/${data._id}`}>
                                {/* <Button icon="pi pi-pencil" severity="warning" /> */}
                                {/* edit icon */}
                                <FaEdit
                                    style={{
                                        fontSize: '1.8rem',
                                        color: '#2196F3',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Link>
                            {/* delete icon */}
                            <MdDelete
                                onClick={() => confirmDeleteProduct(data)}
                                style={{
                                    fontSize: '1.8rem',
                                    color: '#F44336',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (
        data: Product,
        layout: 'grid' | 'list' | (string & Record<string, unknown>)
    ) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>All Products</h5>
                    <DataView
                        loading={isLoading}
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}
                    ></DataView>
                    <Dialog
                        visible={deleteProductDialog}
                        style={{ width: '450px' }}
                        header="Confirm"
                        modal
                        footer={deleteProductDialogFooter}
                        onHide={hideDeleteProductDialog}
                    >
                        <div className="flex align-items-center justify-content-center">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: '2rem' }}
                            />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ListDemo;
