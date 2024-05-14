'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import { FileUpload } from 'primereact/fileupload';
import { MultiSelect } from 'primereact/multiselect';

interface DropdownItem {
    name: string;
    code: string;
}
interface InputValue {
    name: string;
    code: string;
}

const multiselectValues: InputValue[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
];
const FormLayoutDemo = () => {
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],
        []
    );

    const onUpload = (file: any) => {
        console.log(file);
    };

    useEffect(() => {
        setDropdownItem(dropdownItems[0]);
    }, [dropdownItems]);

    const itemTemplate = (option: InputValue) => {
        return (
            <div className="flex align-items-center">
                <img
                    alt={option.name}
                    src={`/demo/images/flag/flag_placeholder.png`}
                    onError={(e) => (e.currentTarget.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    className={`flag flag-${option.code.toLowerCase()}`}
                    style={{ width: '21px' }}
                />
                <span className="ml-2">{option.name}</span>
            </div>
        );
    };

    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Profile</h5>
                    <div className="field">
                        <label htmlFor="name1">Name</label>
                        <InputText id="name1" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="email1">Email</label>
                        <InputText id="email1" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Phone</label>
                        <InputMask mask="(999) 999-9999" placeholder="(999) 999-9999" />
                    </div>
                    <div className="field">
                        <label htmlFor="address">About</label>
                        <InputTextarea id="address" rows={6} />
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Logo</h5>
                    <div className="flex justify-content-center flex-column align-items-center gap-3">
                        <Image src={`/demo/images/galleria/galleria10.jpg`} alt="Image" width="250" preview />
                        <FileUpload mode="basic" name="demo" url="/api/upload" accept="image/*" maxFileSize={1000000} auto onUpload={onUpload} />
                    </div>
                </div>
                <div className="card">
                    <h5>Categories</h5>
                    <MultiSelect
                        style={{ width: '100%' }}
                        value={multiselectValue}
                        onChange={(e) => setMultiselectValue(e.value)}
                        options={multiselectValues}
                        itemTemplate={itemTemplate}
                        optionLabel="name"
                        placeholder="Select Countries"
                        filter
                        className="multiselect-custom"
                        display="chip"
                    />
                </div>
            </div>

            <div className="col-12">
                <div className="card flex justify-content-between">
                    <Button label="Discard"></Button>

                    <Button label="Submit"></Button>
                </div>
            </div>
        </div>
    );
};

export default FormLayoutDemo;
