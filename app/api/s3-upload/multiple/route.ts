import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getMimeType } from '@/lib/utils/mime';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.REGION });

async function uploadFileToS3(file: any, fileName: string) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
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
    return url;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files: any[] = formData.getAll('file'); // Get all files with key 'files'

        if (!files.length) {
            return NextResponse.json(
                { error: 'At least one file is required.' },
                { status: 400 }
            );
        }

        const urls = [];
        for (const file of files) {
            const uploadedFile = await uploadFileToS3(file, file.name);
            urls.push(uploadedFile);
        }

        return NextResponse.json({ urls });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
}
