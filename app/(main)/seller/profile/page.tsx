import { findAll } from '@/lib/categories/service';
import FormLayout from './ProfileForm';
import AvatarUploadPage from './test';

export default async function Profile() {
    const data: any = await findAll();
    const categories = JSON.parse(JSON.stringify(data));
    return <FormLayout categories={categories} />;
    // return <AvatarUploadPage />;
}
