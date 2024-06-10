import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const generateFileName = (file: any) => {
    return `images/${file.name}`;
};
export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const formData = await request.formData();
        const fileArray: any[] = formData.getAll('file');

        console.log(fileArray);

        if (request.body === null) {
            return new NextResponse('Request body is missing', { status: 400 });
        }

        const res = await Promise.all(
            fileArray.map(async (file: any) => {
                const filename = generateFileName(file);
                const blob = await put(filename, file, {
                    access: 'public'
                });
                return blob;
            })
        );

        // ⚠️ The below code is for App Router Route Handlers only

        // Here's the code for Pages API Routes:
        // const blob = await put(filename, request, {
        //   access: 'public',
        // });

        return NextResponse.json(res);
    } catch (error) {
        // The next lines are required for Pages API Routes only
        // export const config = {
        //   api: {
        //     bodyParser: false,
        //   },
        // };

        console.log(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
