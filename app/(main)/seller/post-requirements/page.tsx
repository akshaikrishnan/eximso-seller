import PostRequiremntsView from '@/components/post-requirements';
import { getDocumentsByCategoryIds } from '@/lib/post-requirements/service';
import { findById, findOne } from '@/lib/user/service';
import { getDataFromToken } from '@/lib/utils/getDataFromToken';
import { cookies } from 'next/headers';

export default async function PostRequiremnts() {
    try {
        const cookiestore = cookies();
        const token = cookiestore.get('access_token')?.value || '';
        const { id } = getDataFromToken(token);
        const user = await findById(id);
        const data = await getDocumentsByCategoryIds(user.categories);
        const postRequirements = JSON.parse(JSON.stringify(data));
        console.log(postRequirements);

        return <PostRequiremntsView requirements={postRequirements} />;
    } catch (error) {
        console.log(error);
        return <div>Error</div>;
    }
}
