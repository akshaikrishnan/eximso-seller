import { Button } from 'primereact/button';
import './onboarding.scss';

export default function Onboarding() {
    const dummy = new Array(12).fill({
        name: 'Category Name',
        image: '/demo/images/nature/'
    });
    return (
        <div className="surface-0 text-center w-full h-screen overflow-x-hidden pt-5 px-2 md:px-8">
            <div className="mb-3 font-bold text-3xl">
                <span className="text-900">Choose your </span>
                <span className="text-indigo-600">Categories</span>
            </div>
            <div className="text-700 mb-6">Choose your categories you are selling. You can modify this later.</div>
            <div className="grid">
                {dummy.map((item, i) => (
                    <div key={i} className="col-12 md:col-6 lg:col-4 xl:col-3 mb-2">
                        <input type="checkbox" className="hidden category-check" name="" id={`category${i}`} />
                        <label htmlFor={`category${i}`}>
                            <div className="surface-card shadow-2 p-3 border-round relative">
                                <i className="pi pi-check absolute top-0 right-0 p-2 m-1 bg-indigo-600 text-white border-circle"></i>
                                <div className="flex justify-content-start align-items-center">
                                    <img src={`${item.image}nature${i + 1}.jpg`} alt={item.name} className="w-6rem h-6rem border-circle" />
                                    <div className="text-900 text-xl font-medium ml-3">{item.name}</div>
                                </div>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
            <div className="w-full">
                <Button icon="pi pi-angle-right" size="large" className="p-button-rounded p-button-text" label="Continue"></Button>
            </div>
        </div>
    );
}
