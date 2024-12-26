import Link from 'next/link';
import { Button } from 'primereact/button';

export default function HelpFloat() {
    return (
        <div
            className="fixed bottom-0 left-0 font-bold "
            style={{ minWidth: 120, minHeight: 40, zIndex: 1000 }}
        >
            <Link href="https://wa.me/919037850541" target="_blank">
                <Button
                    icon="pi pi-question"
                    rounded
                    severity="help"
                    aria-label="Help"
                    tooltip="Help"
                    className="m-2"
                />
            </Link>
        </div>
    );
}
