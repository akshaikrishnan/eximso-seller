import React from 'react';

interface EmptyProps {
    title?: string;
    icon?:
        | '404'
        | 'cart'
        | 'connection'
        | 'empty'
        | 'favourites'
        | ' location'
        | 'notifications'
        | 'pictures'
        | 'results';
}

export default function Empty({ title, icon }: { title?: string; icon?: string }) {
    return (
        <div className="w-100 h-100 flex align-items-center justify-content-center p-6">
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/img/Gradient/${icon || 'results'}.svg`} width={200} alt="" />
                {title ? <span>{title}</span> : <span>No Results Found!</span>}
            </div>
        </div>
    );
}
