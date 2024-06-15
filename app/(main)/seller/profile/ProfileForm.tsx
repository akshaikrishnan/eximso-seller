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
import { Dropdown } from 'primereact/dropdown';
import { Profile, UserSegment } from '@/lib/types/user';
import { CountryNameService } from '@/demo/service/CountryService';
import DocumentCard from '@/components/document-card/DocumentCard';
import { endpoints } from '@/lib/constants/endpoints';

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
    const [multiselectValue, setMultiselectValue] = useState(null);

    const multiselectValues: InputValue[] = categories.map((category: any) => {
        return {
            name: category.name,
            image: category.image,
            _id: category._id,
            value: category._id
        };
    });
    const dropdownItems: UserSegment[] = useMemo(
        () => ['Manufacturer', 'Supplier', 'Importer', 'Wholesaler', 'Others'],
        []
    );

    const onUpload = (event: FileUploadUploadEvent) => {
        const { url } = JSON.parse(event.xhr.response);
        setValue('logo', url);
    };
    const onGstUpload = (event: FileUploadUploadEvent) => {
        const { downloadUrl } = JSON.parse(event.xhr.response);
        setValue('gstCertificate', downloadUrl);
    };
    const onChequeUpload = (event: FileUploadUploadEvent) => {
        const { downloadUrl } = JSON.parse(event.xhr.response);
        setValue('bankCheque', downloadUrl);
    };

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
    } = useForm<Profile>({
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
        reset(profile);
    };

    useEffect(() => {
        resetForm();
    }, [profile]);

    const onSubmit = (data: Profile) => {
        console.log(data);
        axios.put('/api/user', data).then((res) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully');
            router.push('/');
        });
    };

    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => CountryNameService.getCountries()
    });

    const ifscCheck = (value: string | undefined) => {
        if (value && value.length === 11) {
            axios.get(`/api/ifsc?ifsc=${value}`).then(({ data }) => {
                setValue('bank.branch', data.BRANCH);
                setValue('bank.name', data.BANK);
            });
        }
        return false;
    };

    const itemTemplate = (option: InputValue) => {
        return (
            <div className="flex align-items-center">
                <img
                    alt={option.name}
                    src={option.image}
                    onError={(e) =>
                        (e.currentTarget.src =
                            'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
                    }
                    style={{ width: '21px' }}
                />
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
                        <label htmlFor="name1">Company Name</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Company Name is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id={field.name}
                                    {...field}
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.name && (
                            <small className="p-error">{errors?.name?.message}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="email1">Email</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        'Invalid email address. E.g. example@email.com'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.email && (
                            <small className="p-error">{errors?.email?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Phone</label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Invalid phone number.'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <InputMask
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                    mask="(999) 999-9999"
                                    unmask
                                    placeholder="(999) 999-9999"
                                />
                            )}
                        />
                        {errors.phone && (
                            <small className="p-error">{errors?.phone?.message}</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="country">Country</label>
                        <Controller
                            name="country"
                            rules={{ required: 'Country is Required' }}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    {...field}
                                    id={field.name}
                                    placeholder="Select Country"
                                    filter
                                    options={countries}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.country && (
                            <small className="p-error">{errors?.country?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="about">Address</label>
                        <Controller
                            name="address"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputTextarea
                                    rows={6}
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.address && (
                            <small className="p-error">{errors?.address?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="name1">
                            GST Number / Any other registration number
                        </label>
                        <Controller
                            name="gstNo"
                            control={control}
                            // rules={{ required: 'GST Number is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    {...field}
                                    id={field.name}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.gstNo && (
                            <small className="p-error">{errors?.gstNo?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="website">Website</label>
                        <Controller
                            name="website"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                                    message: 'Invalid url eg:"https://eximso.com"'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    {...field}
                                    id={field.name}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.website && (
                            <small className="p-error">{errors?.website?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="name1">Segment</label>
                        <Controller
                            name="segment"
                            control={control}
                            rules={{ required: 'Segment is required.' }}
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    id={field.name}
                                    {...field}
                                    options={dropdownItems}
                                    placeholder="Select Segment"
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.name && (
                            <small className="p-error">{errors?.name?.message}</small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="categories">Categories</label>

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
                                    className={classNames('multiselect-custom', {
                                        'p-invalid': fieldState.invalid
                                    })}
                                    display="chip"
                                />
                            )}
                        />
                        {errors.categories ? (
                            <small className="p-error">
                                {errors?.categories?.message?.toString()}
                            </small>
                        ) : null}
                    </div>
                </div>
                <div className="card p-fluid">
                    <h5>Authorized Person Details</h5>
                    <div className="field">
                        <label htmlFor="name1">Name</label>
                        <Controller
                            name="authPerson.name"
                            control={control}
                            rules={{ required: 'Name is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    {...field}
                                    id={field.name}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.authPerson?.name && (
                            <small className="p-error">
                                {errors?.authPerson?.name?.message}
                            </small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="designation">Designation</label>
                        <Controller
                            name="authPerson.designation"
                            control={control}
                            rules={{ required: 'Designation is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    {...field}
                                    id={field.name}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.authPerson?.designation && (
                            <small className="p-error">
                                {errors?.authPerson?.designation?.message}
                            </small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="mobile">Mobile</label>
                        <Controller
                            name="authPerson.phone"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Invalid mobile number.'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <InputMask
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                    mask="(999) 999-9999"
                                    unmask
                                    placeholder="(999) 999-9999"
                                />
                            )}
                        />
                        {errors.authPerson?.phone && (
                            <small className="p-error">
                                {errors?.authPerson?.phone?.message}
                            </small>
                        )}
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <Controller
                            name="authPerson.email"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        'Invalid email address. E.g. example@email.com'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    {...field}
                                    id={field.name}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.authPerson?.email && (
                            <small className="p-error">
                                {errors?.authPerson?.email?.message}
                            </small>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Logo</h5>
                    <div className="flex justify-content-center flex-column align-items-center gap-3">
                        <Image src={watch('logo')} alt="Image" width="250" preview />
                        <FileUpload
                            mode="basic"
                            name="file"
                            url={endpoints.singleUpload}
                            accept="image/*"
                            maxFileSize={45000}
                            auto
                            onUpload={onUpload}
                        />
                    </div>
                </div>
                <div className="card p-fluid">
                    <h5>GST / Registration Certificate</h5>
                    <div className="flex justify-content-center flex-column align-items-center gap-3">
                        <DocumentCard
                            onDelete={() => {
                                setValue('gstCertificate', '', { shouldDirty: true });
                            }}
                            document={watch('gstCertificate')}
                            title="GST Certificate"
                        />

                        <FileUpload
                            mode="basic"
                            name="file"
                            url={endpoints.singleUpload}
                            accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                            maxFileSize={1000000}
                            auto
                            onUpload={onGstUpload}
                        />
                    </div>
                </div>
                <div className="card p-fluid">
                    <h5>Cancelled cheque / Bank statement </h5>
                    <div className="flex justify-content-center flex-column align-items-center gap-3">
                        <DocumentCard
                            onDelete={() => {
                                setValue('bankCheque', '', { shouldDirty: true });
                            }}
                            document={watch('bankCheque')}
                            title="Bank Verification Document"
                        />

                        <FileUpload
                            mode="basic"
                            name="file"
                            url={endpoints.singleUpload}
                            accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                            maxFileSize={1000000}
                            auto
                            onUpload={onChequeUpload}
                        />
                    </div>
                </div>
                <div className="card p-fluid">
                    <h5>Bank Details</h5>
                    <div>
                        <div className="field">
                            <label htmlFor="bank">Account Holder Name</label>
                            <Controller
                                name="bank.accountHolderName"
                                control={control}
                                rules={{ required: 'Account Holder Name is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.bank?.accountHolderName && (
                                <small className="p-error">
                                    {errors?.bank?.accountHolderName?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="bank">IFSC</label>
                            <Controller
                                name="bank.ifsc"
                                control={control}
                                rules={{
                                    required: 'IFSC is required.',
                                    pattern: {
                                        value: /^[A-Z]{4}\d{7}$/,
                                        message: 'Invalid IFSC code'
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        onChange={(e) => {
                                            field.onChange({
                                                ...e,
                                                target: {
                                                    value: e.target.value.toUpperCase()
                                                }
                                            });
                                        }}
                                        onBlur={() => {
                                            field.onBlur();
                                            ifscCheck(field.value);
                                        }}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.bank?.ifsc && (
                                <small className="p-error">
                                    {errors?.bank?.ifsc?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="bank">Account Number</label>
                            <Controller
                                name="bank.accountNo"
                                control={control}
                                rules={{
                                    required: 'Account Number is required.',
                                    pattern: {
                                        value: /^[0-9]{10,18}$/,
                                        message: 'Invalid Account Number'
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.bank?.accountNo && (
                                <small className="p-error">
                                    {errors?.bank?.accountNo?.message}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="bank">Bank Name</label>
                            <Controller
                                name="bank.name"
                                control={control}
                                rules={{ required: 'Bank Name is required.' }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.bank?.name && (
                                <small className="p-error">
                                    {errors?.bank?.name?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="bank">Branch</label>
                            <Controller
                                name="bank.branch"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.bank?.branch && (
                                <small className="p-error">
                                    {errors?.bank?.branch?.message}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card flex justify-content-between">
                    <Button
                        label="Discard"
                        type="reset"
                        onClick={resetForm}
                        severity="secondary"
                    ></Button>

                    <Button disabled={!isDirty} type="submit" label="Update"></Button>
                </div>
            </div>
        </form>
    );
};
export default FormLayout;
