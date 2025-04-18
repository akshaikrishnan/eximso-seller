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
        const file: any = formData.get('file');
        const filename = searchParams.get('filename') || generateFileName(file);
        console.log(filename);

        if (!filename) {
            return new NextResponse('Missing filename', { status: 400 });
        }
        if (request.body === null) {
            return new NextResponse('Request body is missing', { status: 400 });
        }
        // ⚠️ The below code is for App Router Route Handlers only
        const blob = await put(filename, file, {
            access: 'public'
        });

        // Here's the code for Pages API Routes:
        // const blob = await put(filename, request, {
        //   access: 'public',
        // });

        return NextResponse.json(blob);
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

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const numbers = [1, 2, 3, 4, 5, 6, 7];

const arr = days.map((day) => numbers.map((number) => ({ day, number, time: day + number })));

console.log(arr);
