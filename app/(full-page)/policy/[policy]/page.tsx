import { notFound } from 'next/navigation';
import './policy.css';
export default async function page({ params }: { params: { policy: string } }) {
    const baseURL = process.env.NEXT_PUBLIC_API_URL!;

    try {
        const { policy } = params;
        console.log(baseURL + 'policy/' + policy);

        const res = await fetch(baseURL + 'policy/' + policy, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        console.log(data);
        if (data?.result?.content) {
            return (
                <>
                    <main className="container m-auto">
                        <div
                            className="policy-page "
                            dangerouslySetInnerHTML={{ __html: data?.result?.content }}
                        ></div>
                    </main>
                </>
            );
        } else {
            return notFound();
        }
    } catch (e) {
        console.log(e);
        return notFound();
    }
}
