'use client';
import { CountryService } from '@/demo/service/CountryService';
import type { Demo, Page } from '@/types';
import Image from 'next/image';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Chips } from 'primereact/chips';
import { ColorPicker, ColorPickerHSBType, ColorPickerRGBType } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Knob } from 'primereact/knob';
import { ListBox } from 'primereact/listbox';
import { MultiSelect } from 'primereact/multiselect';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { SelectButton } from 'primereact/selectbutton';
import { Slider } from 'primereact/slider';
import { ToggleButton } from 'primereact/togglebutton';
import { useEffect, useState } from 'react';

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
    const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [text, setText] = useState<any>('');
    const dummy = new Array(10).fill({
        name: 'Category Name',
        image: '/demo/images/nature/'
    });

    const selectButtonValues1: InputValue[] = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

    const selectButtonValues2: InputValue[] = [
        { name: 'Option 1', code: 'O1' },
        { name: 'Option 2', code: 'O2' },
        { name: 'Option 3', code: 'O3' }
    ];

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

    return (
        <div className="grid input-demo">
            <div className="col-12  p-fluid md:col-6">
                <div className="card">
                    <h5>Manage Product</h5>
                    <div className="grid formgrid">
                        <div className="field col-12 mb-2  lg:mb-0">
                            <label htmlFor="name1">Name</label>
                            <InputText id="name1" type="text" />
                        </div>
                    </div>
                    <h6>Status</h6>
                    <ToggleButton checked={toggleValue} onChange={(e) => setToggleValue(e.value)} onLabel="Product Active" offLabel="Product Offline" />

                    <h6>Price</h6>
                    <div className="grid formgrid">
                        <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                            <label htmlFor="original">Original Price</label>
                            <InputNumber className="mt-1" id="original" min={0} mode="currency" currency="USD" placeholder="Original Price" />
                        </div>
                        <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                            <label htmlFor="name1">Offer Price</label>
                            <InputNumber className="mt-1" min={0} placeholder="Offer Price" mode="currency" currency="USD" />
                        </div>
                        <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                            <label htmlFor="name1">Percent</label>

                            <span className="mt-1  p-input-icon-right">
                                <InputText type="text" readOnly placeholder="%" />
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
        </div>
    );
};

export default ProductForm;
