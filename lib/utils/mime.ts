interface MimeTypes {
    [key: string]: string[];
}

const mimeTypes: MimeTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/svg+xml': ['.svg'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.ms-excel': ['.xls', '.xlsx'],
    'text/plain': ['.txt', '.text', '.css', '.js', '.html'],
    'application/json': ['.json'],
    'audio/mpeg': ['.mp3'],
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov', '.qt'],
    'application/zip': ['.zip'],
    'application/x-gzip': ['.gz'],
    'font/woff': ['.woff'],
    'font/woff2': ['.woff2'],
    'font/ttf': ['.ttf'],
    'font/otf': ['.otf']
};

export function getMimeType(name: string): string | null {
    const extension = name.split('.').pop() || '';
    for (const contentType in mimeTypes) {
        if (mimeTypes[contentType].includes(extension.toLowerCase())) {
            return contentType;
        }
    }
    return null;
}
