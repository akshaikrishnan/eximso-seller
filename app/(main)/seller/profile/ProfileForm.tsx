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
import Link from 'next/link';
import { Message } from 'primereact/message';

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
        // Validate logo
        if (!data.logo) {
            toast.error('Please upload a company logo');
            return;
        }

        // Validate GST certificate
        if (!data.gstCertificate) {
            toast.error('Please upload GST / Registration Certificate');
            return;
        }

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
        <>
            {/* {!profile?.phone && (
                <Link href="/seller/profile">
                    <Message
                        severity="warn"
                        className="w-full mb-3"
                        text="Please add your phone number in your profile settings to continue adding products."
                    />
                </Link>
            )} */}

            <form className="grid" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-12 md:col-6">
                    <div className="card p-fluid">                  
                        <h5>Profile</h5>
                        <div className="field">    
                            <label htmlFor="name1">Company Name</label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'Company Name is required.',
                                    minLength: {
                                        value: 2,
                                        message: 'Company name must be at least 2 characters'
                                    },
                                    maxLength: {
                                        value: 200,
                                        message: 'Company name must not exceed 200 characters'
                                    }
                                }}
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
                                    <div
                                        className="p-inputgroup"
                                        title="Email cannot change after account creation!"
                                    >
                                        <InputText
                                            readOnly
                                            id={field.name}
                                            {...field}
                                            className={classNames({
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"></i>
                                        </span>
                                    </div>
                                )}
                            />
                            {errors.email && (
                                <small className="p-error">
                                    {errors?.email?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="age1">Phone</label>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: 'Phone is required.',
                                    pattern: {
                                        value: /^(0\d{6,19}|\+?[1-9]\d{6,19})$/,
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
                                <small className="p-error">
                                    {errors?.phone?.message}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="country">Country</label>
                            <Controller
                                name="country"
                                rules={{ required: 'Country is required' }}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Dropdown
                                        {...field}
                                        id={field.name}
                                        placeholder="Select Country"
                                        filter
                                        filterPlaceholder="Search country"
                                        options={countries}
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.country && (
                                <small className="p-error">
                                    {errors?.country?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="about">Address</label>
                            <Controller
                                name="address"
                                control={control}
                                rules={{
                                    required: 'Address is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Address must be at least 10 characters'
                                    },
                                    maxLength: {
                                        value: 500,
                                        message: 'Address must not exceed 500 characters'
                                    }
                                }}
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
                                <small className="p-error">
                                    {errors?.address?.message}
                                </small>
                            )}
                        </div>
                <div className="field">
                  <label htmlFor="postalCode">Postal Code / ZIP Code</label>
                     <Controller
                        name="postalCode"
                        control={control}
                         rules={{
                         required: 'Postal code is required',
                         pattern: {
                            value: /^[A-Za-z0-9\s\-]{3,12}$/, // Adjust for your country/format
                            message: 'Invalid postal code format'
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
                    {errors.postalCode && (
                    <small className="p-error">
                        {errors?.postalCode?.message}
                    </small>
                    )}
                  </div>
                           <div className="field">
                            <label htmlFor="name1">
                                GST Number / Any other registration number
                            </label>
                            <Controller
                                name="gstNo"
                                control={control}
                                rules={{
                                    required: 'GST Number or registration number is required',
                                    pattern: {
                                        value: /^[0-9A-Z]{15}$/,
                                        message: 'Invalid GST Number (must be 15 alphanumeric characters)'
                                    },
                                    minLength: {
                                        value: 5,
                                        message: 'Registration number must be at least 5 characters'
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
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.gstNo && (
                                <small className="p-error">
                                    {errors?.gstNo?.message}
                                </small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="website">Website</label>
                            <Controller
                                name="website"
                                control={control}
                                rules={{
                                    pattern: {
                                       value: /^((https?|ftp|smtp):\/\/)?(www\.)?[a-z0-9][-a-z0-9]*(\.[a-z]{2,}){1,3}(\/[a-zA-Z0-9_#?=&%-]*)*\/?$/i,
                                        message: 'Invalid URL format. E.g. "https://example.com"'
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <InputText
                                        {...field}
                                        id={field.name}
                                        placeholder="https://example.com"
                                        className={classNames({
                                            'p-invalid': fieldState.invalid
                                        })}
                                    />
                                )}
                            />
                            {errors.website && (
                                <small className="p-error">
                                    {errors?.website?.message}
                                </small>
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
                            {errors.segment && (
                                <small className="p-error">{errors?.segment?.message}</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="categories">Categories</label>

                            <Controller
                                name="categories"
                                control={control}
                                rules={{
                                    required: 'At least one category is required.',
                                    validate: (value) =>
                                        (Array.isArray(value) && value.length > 0) ||
                                        'Please select at least one category'
                                }}
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
                                        placeholder="Select Categories"
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
                    {/* <div className="card p-fluid">
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
                    </div> */}
                </div>

                <div className="col-12 md:col-6">
                    <div className="card p-fluid">
                        <h5>Logo <span className="text-red-500">*</span></h5>
                        <div className="flex justify-content-center flex-column align-items-center gap-3">
                            {watch('logo') ? (
                                <Image src={watch('logo')} alt="Company Logo" width="250" preview />
                            ) : (
                                <div className="text-center p-4 border-2 border-dashed surface-border border-round">
                                    <i className="pi pi-image text-4xl text-400"></i>
                                    <p className="text-400">No logo uploaded</p>
                                </div>
                            )}
                            <FileUpload
                                mode="basic"
                                name="file"
                                url={endpoints.singleUpload}
                                accept="image/*"
                                maxFileSize={5242880}
                                auto
                                onUpload={onUpload}
                                chooseLabel="Upload Logo"
                            />
                            {!watch('logo') && (
                                <>
                                    <small className="text-400">Max file size: 5MB. Accepted formats: JPG, PNG, GIF</small>
                                    <small className="text-red-500">* Logo is required</small>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="card p-fluid">
                        <h5>GST / Registration Certificate <span className="text-red-500">*</span></h5>
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
                                accept="image/jpeg,image/jpg,image/gif,image/png,application/pdf,image/x-eps"
                                maxFileSize={1000000}
                                auto
                                onUpload={onGstUpload}
                                chooseLabel={watch('gstCertificate') ? 'Replace Document' : 'Upload Document'}
                            />
                            <small className="text-400">Max file size: 1MB. Accepted formats: PDF, JPG, PNG, GIF, EPS</small>
                            {!watch('gstCertificate') && (
                                <small className="text-red-500">* GST / Registration Certificate is required</small>
                            )}
                        </div>
                    </div>
                    {/* <div className="card p-fluid">
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
                                accept="image/jpeg,image/jpg,image/gif,image/png,application/pdf,image/x-eps"
                                maxFileSize={1000000}
                                auto
                                onUpload={onChequeUpload}
                            />
                        </div>
                    </div> */}
                    {/* <div className="card p-fluid">
                        <h5>
                            Bank Details{' '}
                            <span className="text-sm text-400">(optional)</span>
                        </h5>
                        <div>
                            <div className="field">
                                <label htmlFor="bank">Account Holder Name</label>
                                <Controller
                                    name="bank.accountHolderName"
                                    control={control}
                                    rules={{
                                        minLength: {
                                            value: 2,
                                            message: 'Account holder name must be at least 2 characters'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Account holder name must not exceed 100 characters'
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: 'Account holder name should only contain letters and spaces'
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
                                        pattern: {
                                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                            message: 'Invalid IFSC code format (e.g., SBIN0001234)'
                                        },
                                        minLength: {
                                            value: 11,
                                            message: 'IFSC code must be exactly 11 characters'
                                        },
                                        maxLength: {
                                            value: 11,
                                            message: 'IFSC code must be exactly 11 characters'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            {...field}
                                            id={field.name}
                                            placeholder="SBIN0001234"
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
                                        pattern: {
                                            value: /^[0-9]{9,18}$/,
                                            message: 'Invalid account number (must be 9-18 digits)'
                                        },
                                        minLength: {
                                            value: 9,
                                            message: 'Account number must be at least 9 digits'
                                        },
                                        maxLength: {
                                            value: 18,
                                            message: 'Account number must not exceed 18 digits'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            {...field}
                                            id={field.name}
                                            keyfilter="pint"
                                            placeholder="Enter account number"
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
                                    rules={{
                                        minLength: {
                                            value: 2,
                                            message: 'Bank name must be at least 2 characters'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Bank name must not exceed 100 characters'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            {...field}
                                            id={field.name}
                                            placeholder="Bank name"
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
                                    rules={{
                                        minLength: {
                                            value: 2,
                                            message: 'Branch name must be at least 2 characters'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Branch name must not exceed 100 characters'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText
                                            {...field}
                                            id={field.name}
                                            placeholder="Branch name"
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
                    </div> */}
                    <div className="card p-fluid">
                        <h5>Authorized Person Details</h5>
                        <div className="field">
                            <label htmlFor="name1">Name</label>
                            <Controller
                                name="authPerson.name"
                                control={control}
                                rules={{
                                    required: 'Authorized person name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Name must not exceed 100 characters'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'Name should only contain letters and spaces'
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
                                rules={{
                                    required: 'Designation is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Designation must be at least 2 characters'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Designation must not exceed 100 characters'
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
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Invalid mobile number (must be 10 digits)'
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
                                    required: 'Email is required',
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
        </>
    );
};
export default FormLayout;