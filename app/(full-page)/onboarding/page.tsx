import { Button } from 'primereact/button';
import './onboarding.scss';
import { ScrollPanel } from 'primereact/scrollpanel';
import { findAll } from '@/lib/categories/service';
import { getDataFromToken } from '@/lib/utils/getDataFromToken';
import { cookies } from 'next/headers';
import { update } from '@/lib/user/service';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
    const categories: any = await findAll();
    console.log(categories);
    const dummy = new Array(22).fill({
        name: 'Category Name',
        image: '/demo/images/nature/'
    });
    return (
        <form
            action={async (e) => {
                'use server';
                console.log(e.getAll('category'));
                const selectedCategories = e.getAll('category');
                const token = cookies().get('access_token')?.value || '';
                const { id } = getDataFromToken(token);
                await update(id, {
                    categories: selectedCategories
                });
                redirect('/seller/profile');
            }}
            className="surface-0 text-center w-full h-screen overflow-x-hidden pt-5 px-2 md:px-8"
        >
            <div className="mb-3 font-bold text-3xl">
                <span className="text-900">Choose your </span>
                <span className="text-indigo-600">Categories</span>
            </div>
            <div className="text-700 mb-6">Choose your categories you are selling. You can modify this later.</div>
            <ScrollPanel style={{ width: '100%', height: '70vh' }} className="scroller">
                <div className="grid p-4">
                    {categories.map((item: any) => (
                        <div key={item._id.toString()} className="col-12 md:col-6 lg:col-4 xl:col-3 mb-2">
                            <input type="checkbox" className="hidden category-check" name={'category'} id={item._id.toString()} value={item._id.toString()} />
                            <label htmlFor={item._id.toString()}>
                                <div className="surface-card shadow-2 p-3 border-round relative">
                                    <i className="pi pi-check absolute top-0 right-0 p-2 m-1 bg-indigo-600 text-white border-circle"></i>
                                    <div className="flex justify-content-start align-items-center">
                                        <img src={item.image} alt={item.name} className="w-6rem h-6rem border-circle" />
                                        <div className="text-900 text-xl font-medium ml-3">{item.name}</div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </ScrollPanel>

            <div className="w-full mt-3">
                <Button type="submit" icon="pi pi-angle-right" size="large" className="p-button-rounded p-button-text" label="Continue"></Button>
            </div>
        </form>
    );
}
