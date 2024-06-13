import './spinner.css';

export default function Loader() {
    return (
        <div className="loaderWrapper">
            <div>
                <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        </div>
    );
}
