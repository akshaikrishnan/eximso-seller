'use client';
import {
    CategoryService,
    CountryNameService,
    CountryService
} from '@/demo/service/CountryService';
import { Product } from '@/lib/types/product';
import type { Demo, Page } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'primereact/image';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
// import { Editor } from 'primereact/editor';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import { ToggleButton } from 'primereact/togglebutton';
import { classNames } from 'primereact/utils';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-quill'), {
    ssr: false
});
import 'react-quill/dist/quill.snow.css';
import { endpoints } from '@/lib/constants/endpoints';
import Link from 'next/link';
import { Message } from 'primereact/message';
import { useChat } from '@ai-sdk/react';
import { FaMagic } from 'react-icons/fa';
import { stripFences, splitSections, parseKeywords } from '@/lib/utils/ai';

const ProductForm: Page = ({
    mode,
    product = {}
}: {
    mode?: 'update' | 'add';
    product?: any;
}) => {
    const [autoValue, setAutoValue] = useState<Demo.Country[]>([]);
    const [percentage, setPercentage] = useState(0);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { messages, sendMessage } = useChat();

    const [aiPending, setAiPending] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // track the last seen assistant message id and length, to detect growth
    const lastAssistantIdRef = useRef<string | null>(null);
    const lastLenRef = useRef<number>(0);
    const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        CategoryService.getUserCategories().then((data) => setAutoValue(data));
    }, []);

    const { data: categories } = useQuery({
        queryKey: ['user-categories'],
        queryFn: CategoryService.getUserCategories
    });

    const mutation = useMutation({
        mutationFn: (data: Product) => {
            if (mode === 'update') return axios.put('/api/product', data);
            return axios.post('/api/product', data);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] }).then(() => {
                router.push('/seller/products');
            });
            toast.success(
                `Product ${mode === 'update' ? 'updated' : ' added'} successfully`
            );
        }
    });

    const {
        control,
        watch,
        setValue,
        formState: { errors },
        handleSubmit
    } = useForm<Product>({
        defaultValues: {
            name: '',
            isActive: true,
            stock: 0,
            isSampleAvailable: false,
            isPrivateLabeling: false,
            ...product
        }
    });

    const { data: subCategories, isLoading } = useQuery({
        queryKey: ['sub-categories', watch('category')],
        queryFn: () => CategoryService.getSubCategories(watch('category'))
    });
    const { data: countries } = useQuery({
        queryKey: ['countries'],
        queryFn: () => CountryNameService.getCountries()
    });

    let priceWatch = watch('price');
    let offerPriceWatch = watch('offerPrice');

    const onSubmit = (data: Product) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        if (priceWatch && offerPriceWatch) {
            setPercentage(((priceWatch - offerPriceWatch) / priceWatch) * 100);
            return;
        }
        setPercentage(0);
    }, [priceWatch, offerPriceWatch]);

    const onImagesUpload = (event: FileUploadUploadEvent) => {
        const { urls } = JSON.parse(event.xhr.response);
        setValue('images', urls, { shouldDirty: true });
    };
    const onVideosUpload = (event: FileUploadUploadEvent) => {
        const { urls } = JSON.parse(event.xhr.response);
        setValue('videos', urls, { shouldDirty: true });
    };
    const onImageUpload = (event: FileUploadUploadEvent) => {
        const { url } = JSON.parse(event.xhr.response);
        setValue('thumbnail', url, { shouldDirty: true });
    };

    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            return axios.get('/api/user').then((res) => res.data);
        }
    });

    useEffect(() => {
        if (!aiPending) return;

        // get the latest assistant message (AI SDK grows one message as it streams)
        const assistant = [...messages].reverse().find((m) => m.role === 'assistant');
        if (!assistant) return;

        const raw = (assistant.parts ?? [])
            .map((p: any) => (p?.type === 'text' ? p.text : ''))
            .join('');

        const cleaned = stripFences(raw);
        const { html, kw } = splitSections(cleaned);

        // STREAM: update description when html grows
        if (html && html.length > lastLenRef.current) {
            lastLenRef.current = html.length;
            setValue('detailedDescription', html, { shouldDirty: true });
        }

        // (re)arm settle timer — if no growth for 900ms, we consider it done
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        settleTimerRef.current = setTimeout(() => {
            // final parse at settle time (safer)
            const finalRaw = (assistant.parts ?? [])
                .map((p: any) => (p?.type === 'text' ? p.text : ''))
                .join('');
            const finalClean = stripFences(finalRaw);
            const { html: finalHtml, kw: finalKw } = splitSections(finalClean);

            if (finalHtml) {
                setValue('detailedDescription', finalHtml, { shouldDirty: true });
            }

            const tags = parseKeywords(finalKw);
            if (tags.length) {
                setValue('tags', tags, { shouldDirty: true });
            }

            setAiPending(false);
            setHasGenerated(true);
            toast.success('AI description & keywords added. Review before saving.');
        }, 900);
    }, [messages, aiPending, setValue]);

    const prompt = `
You are writing a detailed, professional product description for a B2B/B2C marketplace rich text editor.

Product name: "${watch('name') || ''}"
Short description: "${watch('shortDescription') || ''}"
Highlight a few key benefits with <strong> for important phrases and <em> for subtle emphasis. Keep it professional.
Write two sections, exactly in this order and format, with no markdown, no code fences, and no extra headers:

---HTML---
(Write clean, structured HTML only. Do not include <html>, <head>, or <body>.
Length: 350-500 words, comprehensive but concise.
Structure:
- Intro paragraph: 3-4 sentences, highlighting the product name and its core value.
- Features: use <ul><li> with 6-10 well-written, benefit-oriented bullet points.
- Specifications / details: another <ul><li> list with clear technical or functional attributes.
- Applications / usage: 2-3 paragraphs describing how and where the product can be used.
- Closing: a short summary paragraph emphasizing reliability, quality, or value.
Avoid hype words like "best in the world", avoid pricing/shipping/warranty info, avoid external links.)
---KEYWORDS---
(Provide 12-20 simple, lowercase, comma-separated keywords or phrases. 
Base them on product name, category, and description. 
Prefer short 1-3 word phrases. No duplicates, no punctuation except commas.)
`.trim();

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

            <form className="grid input-demo" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-12  p-fluid md:col-6">
                    <div className="card">
                        <h5>Manage Product</h5>
                        <div className="grid formgrid">
                            <div className="field col-12 mb-2  lg:mb-0">
                                <h6>Product Name</h6>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required.' }}
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
                                    <small className="p-error">
                                        {errors?.name?.message}
                                    </small>
                                )}
                            </div>
                        </div>
                        <h6>Model Number</h6>
                        <Controller
                            name="modelNumber"
                            control={control}
                            // rules={{ required: 'Model Number is required.' }}
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
                        {errors.modelNumber && (
                            <small className="p-error">
                                {errors?.modelNumber?.message}
                            </small>
                        )}
                        <h6>Status</h6>
                        <ToggleButton
                            checked={watch('isActive')}
                            onChange={(e) =>
                                setValue('isActive', e.value, { shouldDirty: true })
                            }
                            onLabel="Product Active"
                            offLabel="Product Offline"
                        />
                        <h6>Price</h6>
                        <div className="grid formgrid">
                            <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                                <label htmlFor="original">Original Price</label>
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: 'Price is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            id={field.name}
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            min={0}
                                            mode="currency"
                                            currency="INR"
                                            placeholder="Original Price"
                                            className={classNames('mt-1', {
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors.price && (
                                    <small className="p-error">
                                        {errors?.price?.message}
                                    </small>
                                )}
                            </div>

                            <div className="col-12 mb-2 lg:col-5 lg:mb-0">
                                <label htmlFor="name1">Offer Price</label>
                                <Controller
                                    name="offerPrice"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                            value
                                                ? value < priceWatch ||
                                                  'Offer price should be less than original price'
                                                : true
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            id={field.name}
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            min={0}
                                            mode="currency"
                                            currency="INR"
                                            placeholder="Offer Price"
                                            className={classNames('mt-1', {
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors.offerPrice && (
                                    <small className="p-error">
                                        {errors?.offerPrice?.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-12 mb-2 lg:col-2 lg:mb-0">
                                <label htmlFor="name1">Percent</label>

                                <span className="mt-1  p-input-icon-right">
                                    <InputNumber
                                        value={percentage}
                                        readOnly
                                        placeholder="%"
                                    />
                                    <i className="pi pi-percentage" />
                                </span>
                            </div>
                        </div>
                        <h6>Category</h6>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: 'Category is required.' }}
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                    placeholder="Select a Category"
                                    options={categories}
                                    optionValue="_id"
                                    filter
                                    optionLabel="name"
                                />
                            )}
                        />
                        <small>
                            Can&apos;t find your category? Please check your selling
                            categories in{' '}
                            <Link href="/seller/profile">
                                Profile section <br />
                            </Link>
                        </small>
                        {errors.category && (
                            <small className="p-error">
                                {typeof errors?.category?.message === 'string'
                                    ? errors?.category?.message
                                    : ''}
                            </small>
                        )}
                        <h6>Sub-Category</h6>
                        <Controller
                            name="subcategory"
                            control={control}
                            rules={{
                                required:
                                    subCategories?.length > 0
                                        ? 'Sub-Category is required.'
                                        : false
                            }}
                            render={({ field, fieldState }) => (
                                <Dropdown
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                    placeholder="Select a Category"
                                    options={subCategories}
                                    optionValue="_id"
                                    emptyMessage={
                                        isLoading
                                            ? 'Loading...'
                                            : 'No Subcategories found'
                                    }
                                    filter
                                    optionLabel="name"
                                />
                            )}
                        />
                        {errors.category && (
                            <small className="p-error">
                                {typeof errors?.category?.message === 'string'
                                    ? errors?.category?.message
                                    : ''}
                            </small>
                        )}
                        <h6>Manufactured by / Brand</h6>
                        <Controller
                            name="brand"
                            control={control}
                            rules={{ required: 'Brand is required.' }}
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
                        {errors.brand && (
                            <small className="p-error">{errors?.brand?.message}</small>
                        )}
                        <h6>Country of Origin</h6>
                        <Controller
                            name="countryOfOrigin"
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
                        {errors.countryOfOrigin && (
                            <small className="p-error">
                                {errors?.countryOfOrigin?.message}
                            </small>
                        )}
                        <h6>Short Description</h6>
                        <Controller
                            name="shortDescription"
                            control={control}
                            rules={{ required: 'Short Description is required.' }}
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
                        {errors.shortDescription && (
                            <small className="p-error">
                                {errors?.shortDescription?.message}
                            </small>
                        )}
                        <Message
                            severity="info"
                            text="Tip: Write a short description of the product and click on the 'Generate with AI' button to generate a detailed description."
                            className="mb-3"
                        />
                        <div className="flex mb-2 mt-4 align-items-center justify-content-between">
                            <h6 className="mb-0 w-full">Detailed Description</h6>{' '}
                            <Button
                                type="button"
                                label={
                                    aiPending
                                        ? 'Generating…'
                                        : hasGenerated
                                        ? 'Regenerate with AI'
                                        : 'Generate with AI'
                                }
                                icon={<FaMagic />}
                                loading={aiPending}
                                disabled={!watch('shortDescription')}
                                title="Generate detailed description using AI from the above short description. Click to generate."
                                onClick={() => {
                                    // reset trackers for a new run
                                    setHasGenerated(true);
                                    lastAssistantIdRef.current = null;
                                    lastLenRef.current = 0;
                                    if (settleTimerRef.current)
                                        clearTimeout(settleTimerRef.current);

                                    // (optional) clear existing description before streaming
                                    setValue('detailedDescription', '', {
                                        shouldDirty: true
                                    });

                                    setAiPending(true);
                                    sendMessage({ text: prompt });
                                }}
                                outlined
                                badge={hasGenerated ? undefined : 'NEW'}
                                badgeClassName="p-badge-danger"
                            />
                        </div>

                        <Controller
                            name="detailedDescription"
                            control={control}
                            rules={{ required: 'Detailed Description is required.' }}
                            render={({ field, fieldState }) => (
                                <Editor
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    readOnly={aiPending}
                                    defaultValue={'afsdsd'}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.detailedDescription && (
                            <small className="p-error">
                                {errors?.detailedDescription?.message}
                            </small>
                        )}
                        <h6>Available Stock</h6>
                        <Controller
                            name="stock"
                            control={control}
                            rules={{ required: 'Stock is required.' }}
                            render={({ field, fieldState }) => (
                                <InputNumber
                                    id={field.name}
                                    ref={field.ref}
                                    min={0}
                                    showButtons
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                        field.onChange({ target: { value: e.value } })
                                    }
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.stock && (
                            <small className="p-error">{errors?.stock?.message}</small>
                        )}
                        <h6>Tags</h6>
                        <Controller
                            name="tags"
                            control={control}
                            rules={{ required: 'Tags is required.' }}
                            render={({ field, fieldState }) => (
                                <Chips
                                    id={field.name}
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                        field.onChange({ target: { value: e.value } })
                                    }
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        <small>
                            Type and hit{' '}
                            <kbd className="border-solid border-round-sm surface-border border-1 px-1">
                                Enter
                            </kbd>{' '}
                            key to add Tag
                        </small>
                        {errors.tags && (
                            <small className="p-error">{errors?.tags?.message}</small>
                        )}
                    </div>
                </div>

                <div className="col-12 md:col-6">
                    <div className="card p-fluid">
                        <h5>Thumbnail</h5>
                        <div className="flex justify-content-center flex-column align-items-center gap-3">
                            <Image src={watch('thumbnail')} alt="Image" width="250" />
                            <FileUpload
                                mode="basic"
                                name="file"
                                url={endpoints.singleUpload}
                                accept="image/*"
                                maxFileSize={5242880}
                                auto
                                onUpload={onImageUpload}
                            />
                        </div>
                    </div>
                    <div className="card">
                        <h5>Upload Images</h5>
                        <FileUpload
                            name="file"
                            url={endpoints.multipleUpload}
                            multiple
                            accept="image/*"
                            maxFileSize={10000000}
                            onUpload={onImagesUpload}
                            emptyTemplate={
                                <p className="m-0 py-5">
                                    Drag and drop files to here to upload.
                                </p>
                            }
                        />

                        <h6>Uploaded Images</h6>
                        <div className="grid pt-4 gap-4">
                            {watch('images') &&
                                watch('images').map((item, i) => (
                                    <div key={i} className="col-6 md:col-4 mb-2 relative">
                                        <img
                                            src={item}
                                            alt="image"
                                            style={{ objectFit: 'contain' }}
                                            className="w-full shadow-2 rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = watch('images').filter(
                                                    (_, index) => index !== i
                                                );
                                                setValue('images', updated);
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="card">
                        <h5>Product Videos</h5>
                        <FileUpload
                            name="file"
                            url={endpoints.multipleUpload}
                            multiple
                            accept="video/*"
                            maxFileSize={700000}
                            onUpload={onVideosUpload}
                            emptyTemplate={
                                <p className="m-0 py-5">
                                    Drag and drop files to here to upload.
                                </p>
                            }
                        />
                        <h6>Uploaded Videos</h6>
                        <div className="grid pt-2">
                            {watch('videos') &&
                                watch('videos').map((item, i) => (
                                    <div key={i} className="col-6 md:col-4 mb-2">
                                        <video
                                            src={item}
                                            controls={false}
                                            style={{
                                                objectFit: 'contain',
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="card">
                        <h5>Dimensions</h5>
                        <div className="grid p-fluid">
                            <div className="col-12 lg:col-6">
                                <label htmlFor="length">Length</label>
                                <Controller
                                    name="dimensions.length"
                                    control={control}
                                    rules={{ required: 'Length is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            placeholder="(Enter length in cm)"
                                            suffix="cm"
                                            id={field.name}
                                            ref={field.ref}
                                            min={0}
                                            minFractionDigits={2}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            className={classNames({
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors?.dimensions?.length && (
                                    <small className="p-error">
                                        {errors?.dimensions?.length?.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-12 lg:col-6">
                                <label htmlFor="length">Width</label>
                                <Controller
                                    name="dimensions.width"
                                    control={control}
                                    rules={{ required: 'Width is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            placeholder="(Enter width in cm)"
                                            suffix="cm"
                                            id={field.name}
                                            ref={field.ref}
                                            min={0}
                                            minFractionDigits={2}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            className={classNames({
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors?.dimensions?.width && (
                                    <small className="p-error">
                                        {errors?.dimensions?.width?.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-12 lg:col-6">
                                <label htmlFor="length">Height</label>
                                <Controller
                                    name="dimensions.height"
                                    control={control}
                                    rules={{ required: 'Height is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            placeholder="(Enter height in cm)"
                                            suffix="cm"
                                            id={field.name}
                                            ref={field.ref}
                                            min={0}
                                            value={field.value}
                                            minFractionDigits={2}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            className={classNames({
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors?.dimensions?.height && (
                                    <small className="p-error">
                                        {errors?.dimensions?.height?.message}
                                    </small>
                                )}
                            </div>
                            <div className="col-12 lg:col-6">
                                <label htmlFor="length">Weight</label>
                                <Controller
                                    name="dimensions.weight"
                                    control={control}
                                    rules={{ required: 'Weight is required.' }}
                                    render={({ field, fieldState }) => (
                                        <InputNumber
                                            placeholder="(Minimum 1 kg)"
                                            suffix="kg"
                                            id={field.name}
                                            ref={field.ref}
                                            min={0}
                                            minFractionDigits={2}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(e) =>
                                                field.onChange({
                                                    target: { value: e.value }
                                                })
                                            }
                                            className={classNames({
                                                'p-invalid': fieldState.invalid
                                            })}
                                        />
                                    )}
                                />
                                {errors?.dimensions?.weight && (
                                    <small className="p-error">
                                        {errors?.dimensions?.weight?.message}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card p-fluid">
                        <h5>Configurations</h5>
                        <h6>Unit of Measurement (UOM)</h6>
                        <Controller
                            name="uom"
                            control={control}
                            rules={{ required: 'UOM is required.' }}
                            render={({ field, fieldState }) => (
                                <InputText
                                    placeholder="(Ex:- cm, kg, ml etc.)"
                                    id={field.name}
                                    {...field}
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors?.uom && (
                            <small className="p-error">{errors?.uom?.message}</small>
                        )}
                        <h6>Minimum Order Quantity</h6>
                        <Controller
                            name="minimumOrderQuantity"
                            control={control}
                            rules={{ required: 'Minimum Order Quantity is required.' }}
                            render={({ field, fieldState }) => (
                                <InputNumber
                                    id={field.name}
                                    ref={field.ref}
                                    min={0}
                                    showButtons
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                        field.onChange({ target: { value: e.value } })
                                    }
                                    className={classNames({
                                        'p-invalid': fieldState.invalid
                                    })}
                                />
                            )}
                        />
                        {errors.minimumOrderQuantity && (
                            <small className="p-error">
                                {errors?.minimumOrderQuantity?.message}
                            </small>
                        )}

                        <h6>Sample Available</h6>
                        <ToggleButton
                            checked={watch('isSampleAvailable')}
                            onChange={(e) =>
                                setValue('isSampleAvailable', e.value, {
                                    shouldDirty: true
                                })
                            }
                        />
                        <h6>Private Labeling</h6>
                        <ToggleButton
                            checked={watch('isPrivateLabeling')}
                            onChange={(e) =>
                                setValue('isPrivateLabeling', e.value, {
                                    shouldDirty: true
                                })
                            }
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="card flex justify-content-between">
                        <Button
                            type="reset"
                            onClick={() => {
                                router.back();
                            }}
                            label="Discard"
                            severity="secondary"
                        ></Button>
                        <Button
                            loading={mutation.isPending}
                            disabled={!profile?.phone}
                            label={mode === 'update' ? 'Update Product' : 'Add Product'}
                            icon="pi pi-check"
                        ></Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ProductForm;
