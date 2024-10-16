import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface IMGProps {
    src: string;
    alt: string;
    onFullScreenChange?: (isFullScreen: boolean) => void;
    className?: string;
}

const IMG: React.FC<IMGProps> = ({ src, alt, onFullScreenChange, className }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setIsOpen(true);
        if (onFullScreenChange) {
            onFullScreenChange(true);
        }
    };

    const handleClose = (): void => {
        setIsOpen(false);
        if (onFullScreenChange) {
            onFullScreenChange(false);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent): void => {
            if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
            }
        };

        if (isOpen) {
            document.body.classList.add("overflow-hidden");
            window.addEventListener("keydown", handleKeyPress, true);
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            window.removeEventListener("keydown", handleKeyPress, true);
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const modalContent = isOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
            onClick={handleOverlayClick}
        >
            <button
                className="absolute top-4 right-4 text-white text-3xl font-bold"
                onClick={handleClose}
            >
                &times;
            </button>

            <img
                src={src}
                alt={alt}
                className="max-w-[90vw] max-h-[90vh] object-contain"
            />
        </div>
    );

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={`cursor-pointer ${className || ''} w-8 h-8`}
                onClick={handleOpen}
            />
            {isOpen && ReactDOM.createPortal(modalContent, document.body)}
        </>
    );
};

export default IMG;