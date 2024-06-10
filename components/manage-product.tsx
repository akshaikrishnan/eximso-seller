'use client';
import { CountryService } from '@/demo/service/CountryService';
import { Product } from '@/lib/types/product';
import type { Demo, Page } from '@/types';
import Image from 'next/image';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import { ToggleButton } from 'primereact/togglebutton';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface InputValue {
    name: string;
    code: string;
}

const ProductForm: Page = () => {
    const [autoValue, setAutoValue] = useState<Demo.Country[]>([]);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState<Demo.Country[]>([]);
    const [inputNumberValue, setInputNumberValue] = useState<number | null>(null);
    const [chipsValue, setChipsValue] = useState<any[]>([]);
    const [toggleValue, setToggleValue] = useState(false);
    const [text, setText] = useState<any>('');
    const dummy = new Array(10).fill({
        name: 'Category Name',
        image: '/demo/images/nature/'
    });

    useEffect(() => {
        CountryService.getCountries().then((data) => setAutoValue(data));
    }, []);

    const searchCountry = (event: AutoCompleteCompleteEvent) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };

    const {
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm<Product>({
        defaultValues: {
            name: '',
            isActive: true
        }
    });

    const price = watch('price');
    const offerPrice = watch('offerPrice');

    const getPercent = () => {
        if (price && offerPrice) {
            return Math.round(((price - offerPrice) / price) * 100);
        }
        return 0;
    };
    return (
        <form className="grid input-demo">
            <div className="col-12  p-fluid md:col-6">
                <div className="card">
                    <h5>Manage Product</h5>
                    <div className="grid formgrid">
                        <div className="field col-12 mb-2  lg:mb-0">
                            <label htmlFor="name1">Name</label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required.' }}
                                render={({ field, fieldState }) => <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />}
                            />
                            {/* <InputText id="name1" type="text" /> */}
                        </div>
                    </div>
                    <h6>Status</h6>

                    <ToggleButton checked={watch('isActive')} onChange={(e) => setValue('isActive', e.value)} onLabel="Product Active" offLabel="Product Offline" />

                    <h6>Price</h6>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                            <label htmlFor="original">Original Price</label>
                            <Controller
                                name="price"
                                control={control}
                                rules={{ required: 'Name is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputNumber
                                        id={field.name}
                                        ref={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        min={0}
                                        mode="currency"
                                        currency="USD"
                                        placeholder="Original Price"
                                        className={classNames('mt-1', { 'p-invalid': fieldState.invalid })}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                            <label htmlFor="name1">Offer Price</label>
                            <Controller
                                name="offerPrice"
                                control={control}
                                rules={{ required: 'Name is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputNumber
                                        id={field.name}
                                        ref={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        min={0}
                                        mode="currency"
                                        currency="USD"
                                        placeholder="Offer Price"
                                        className={classNames('mt-1', { 'p-invalid': fieldState.invalid })}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <label htmlFor="name1">Percent</label>

                            <span className="mt-1  p-input-icon-right">
                                <InputNumber value={getPercent()} readOnly placeholder="%" />
                                <i className="pi pi-percentage" />
                            </span>
                        </div>
                    </div>
                    <h6>Categories</h6>
                    <AutoComplete placeholder="Search" id="dd" dropdown multiple value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />

                    <h6>Manufactured by / Brand</h6>
                    <InputText id="name1" type="text" />

                    <h6>Short Description</h6>
                    <InputTextarea placeholder="Your Message" rows={5} cols={30} />

                    <h6>Detailed Description</h6>
                    <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />

                    <h6>Stock</h6>
                    <InputNumber value={inputNumberValue} min={0} onValueChange={(e) => setInputNumberValue(e.value ?? null)} showButtons mode="decimal"></InputNumber>

                    <h6>Tags</h6>
                    <Chips value={chipsValue} onChange={(e) => setChipsValue(e.value ?? [])} />
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Upload Images</h5>
                    <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={10000000} emptyTemplate={<p className="m-0 py-5">Drag and drop files to here to upload.</p>} />
                </div>

                <div className="card">
                    <h5>Product Images</h5>
                    <div className="grid">
                        {dummy.map((item, i) => (
                            <div key={i} className="col-6 md:col-4 mb-2">
                                <Image width={300} height={100} src={`${item.image}nature${i + 1}.jpg`} alt={item.name} style={{ objectFit: 'contain' }} className="w-full shadow-2" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h5>Dimensions</h5>
                    <div className="grid p-fluid">
                        <div className="col-12 lg:col-6">
                            <label htmlFor="length">Length</label>
                            <InputNumber suffix=" cm" />
                        </div>
                        <div className="col-12 lg:col-6">
                            <label htmlFor="length">Width</label>
                            <InputNumber suffix=" cm" />
                        </div>
                        <div className="col-12 lg:col-6">
                            <label htmlFor="length">Height</label>
                            <InputNumber suffix=" cm" />
                        </div>
                        <div className="col-12 lg:col-6">
                            <label htmlFor="length">Weight</label>
                            <InputNumber suffix=" gm" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card flex justify-content-between">
                    <Button label="Discard" severity="secondary"></Button>

                    <Button label="Submit"></Button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
