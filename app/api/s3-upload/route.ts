import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getMimeType } from '@/lib/utils/mime';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.REGION });

async function uploadFileToS3(file: any, fileName: string) {
    const fileBuffer = file;
    const mimeType = getMimeType(fileName);
    fileName = `${uuidv4()}-${fileName}`;
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${fileName}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType || ''
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(data);
    return { url, fileName };
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file: any = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'File is required.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await uploadFileToS3(buffer, file.name);

        return NextResponse.json({
            success: true,
            url: data.url,
            fileName: data.fileName,
            downloadUrl: data.url
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
}
