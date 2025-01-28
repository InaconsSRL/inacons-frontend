import React from 'react';

export type ColorVariant = 'green' | 'yellow' | 'red' | 'blue' | 'white' | 'black';

interface ModalAlertProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: ColorVariant;
}

const getColorClasses = (variant: ColorVariant) => {
    const colorMap = {
        green: 'bg-green-600 hover:bg-green-700',
        yellow: 'bg-yellow-600 hover:bg-yellow-700',
        red: 'bg-red-600 hover:bg-red-700',
        blue: 'bg-blue-600 hover:bg-blue-700',
        white: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
        black: 'bg-gray-800 hover:bg-gray-900'
    };

    return colorMap[variant];
};

const ModalAlert: React.FC<ModalAlertProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    variant = 'green'
}) => {
    if (!isOpen) return null;

    const buttonColorClass = getColorClasses(variant);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-96 ">
                <div className={`${buttonColorClass} pt-3 px-4 pb-2 flex flex-col justify-center items-center rounded-t-lg mb-2`}>
                    <h2 className="text-xl font-bold text-gray-200">{title}</h2>
                </div>
                <p className="text-gray-300  pl-4 pt-4  mb-6">{message}</p>
                <div className="flex justify-end space-x-3 px-4 pb-4" >
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded ${buttonColorClass}`}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAlert;
