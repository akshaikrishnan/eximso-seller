import ProductForm from '@/components/manage-product';
import { findOne } from '@/lib/products/service';

export default async function ManageProduct({
    params
}: {
    params: {
        id: string;
    };
}) {
    try {
        const data = await findOne({ _id: params.id });
        const product = JSON.parse(JSON.stringify(data));
        return <ProductForm mode="update" product={product} />;
    } catch (error) {
        console.log(error);
        // redirect('/404');
        return <div>Something went wrong</div>;
    }
}
