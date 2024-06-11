import Link from 'next/link';
import React from 'react';

export default function DocumentCard({
    document,
    title,
    onDelete
}: {
    document: string | undefined;
    title: string;
    onDelete: () => void;
}) {
    if (!document) return null;
    return (
        <div className="col-12">
            <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                <div className="flex justify-content-between mb-3">
                    <div className="flex gap-2">
                        <div className="bg-blue-500 p-3 border-round">
                            <i className="pi pi-file text-2xl text-white"></i>
                        </div>
                        <div>
                            <span className="block text-500 font-medium mb-3">
                                {title}
                            </span>
                            <div className="text-900 font-medium text-xl capitalize">
                                {document?.split('.').pop()?.split('?')?.[0]} document
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={document}
                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-download text-blue-500 text-xl"></i>
                        </Link>
                        <div
                            onClick={onDelete}
                            className="flex align-items-center justify-content-center bg-red-100 border-round cursor-pointer"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-trash text-red-500 text-xl"></i>
                        </div>
                    </div>
                </div>
                <span className="text-green-500 font-medium">Download </span>
                <span className="text-500">to view file</span>
            </div>
        </div>
    );
}
