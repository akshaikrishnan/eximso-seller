'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { Image } from 'primereact/image';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { MultiSelect } from 'primereact/multiselect';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProfileForm {
    categories: any;
    name: string;
    email: string;
    phone: string;
    about: string;
    logo: string;
}

interface DropdownItem {
    name: string;
    code: string;
}
interface InputValue {
    name: string;
    image: string;
    _id: string;
}

const FormLayout = ({ categories }: { categories: any }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [dropdownItem, setDropdownItem] = useState<DropdownItem | null>(null);
    const [multiselectValue, setMultiselectValue] = useState(null);

    const multiselectValues: InputValue[] = categories.map((category: any) => {
        return {
            name: category.name,
            image: category.image,
            _id: category._id,
            value: category._id
        };
    });
    const dropdownItems: DropdownItem[] = useMemo(
        () => [
            { name: 'Option 1', code: 'Option 1' },
            { name: 'Option 2', code: 'Option 2' },
            { name: 'Option 3', code: 'Option 3' }
        ],
        []
    );

    const onUpload = (event: FileUploadUploadEvent) => {
        const { url } = JSON.parse(event.xhr.response);
        setValue('logo', url);
    };

    useEffect(() => {
        setDropdownItem(dropdownItems[0]);
    }, [dropdownItems]);
    useEffect(() => {
        console.log(multiselectValue);
    }, [multiselectValue]);
    const {
        data: profile,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['profile'],

        queryFn: async () => {
            return axios.get('/api/user').then((res) => res.data);
        }
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty }
    } = useForm<ProfileForm>({
        defaultValues: {
            name: profile?.name,
            email: profile?.email,
            phone: profile?.phone,
            about: profile?.about,
            logo: profile?.logo,
            categories: profile?.categories
        }
    });

    const resetForm = () => {
        reset({ name: profile?.name, email: profile?.email, phone: profile?.phone, about: profile?.about, logo: profile?.logo, categories: profile?.categories });
    };

    useEffect(() => {
        resetForm();
    }, [profile]);

    const onSubmit = (data: ProfileForm) => {
        console.log(data);
        axios.put('/api/user', data).then((res) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully');
            router.push('/');
        });
    };

    const itemTemplate = (option: InputValue) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.name} src={option.image} onError={(e) => (e.currentTarget.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} style={{ width: '21px' }} />
                <span className="ml-2">{option.name}</span>
            </div>
        );
    };

    return (
        <form className="grid" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Profile</h5>
                    <div className="field">
                        <label htmlFor="name1">Name</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required.' }}
                            render={({ field, fieldState }) => <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />}
                        />
                        {errors.name && <small className="p-error">{errors?.name?.message}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="email1">Email</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                            render={({ field, fieldState }) => <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />}
                        />
                        {errors.email && <small className="p-error">{errors?.email?.message}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Phone</label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number.' } }}
                            render={({ field, fieldState }) => <InputMask id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} mask="(999) 999-9999" unmask placeholder="(999) 999-9999" />}
                        />
                        {errors.phone && <small className="p-error">{errors?.phone?.message}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="about">About</label>
                        <Controller name="about" control={control} render={({ field, fieldState }) => <InputTextarea rows={6} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />} />
                        {errors.about && <small className="p-error">{errors?.about?.message}</small>}
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Logo</h5>
                    <div className="flex justify-content-center flex-column align-items-center gap-3">
                        <Image src={watch('logo') || profile?.logo} alt="Image" width="250" preview />
                        <FileUpload mode="basic" name="file" url="/api/upload" accept="image/*" maxFileSize={1000000} auto onUpload={onUpload} />
                    </div>
                </div>
                <div className="card">
                    <h5>Categories</h5>

                    <Controller
                        name="categories"
                        control={control}
                        rules={{ required: 'Categories are required.' }}
                        render={({ field, fieldState }) => (
                            <MultiSelect
                                id={field.name}
                                {...field}
                                style={{ width: '100%' }}
                                // value={multiselectValue}
                                // onChange={(e) => setMultiselectValue(e.value)}
                                options={multiselectValues}
                                itemTemplate={itemTemplate}
                                optionLabel="name"
                                placeholder="Select Countries"
                                filter
                                className={classNames('multiselect-custom', { 'p-invalid': fieldState.invalid })}
                                display="chip"
                            />
                        )}
                    />
                    {errors.categories ? <small className="p-error">{errors?.categories?.message?.toString()}</small> : null}
                </div>
            </div>

            <div className="col-12">
                <div className="card flex justify-content-between">
                    <Button label="Discard" onClick={resetForm} severity="secondary"></Button>

                    <Button disabled={!isDirty} type="submit" label="Update"></Button>
                </div>
            </div>
        </form>
    );
};
export default FormLayout;
