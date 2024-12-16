import React from 'react';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import { ValidationError } from '../utils/validaciones';

interface ValidationErrorsProps {
    errors: ValidationError[];
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
    if (!errors || errors.length === 0) return null;

    const errorMessages = errors.filter(error => error.type === 'error' || !error.type);
    const warningMessages = errors.filter(error => error.type === 'warning');

    return (
        <div className="space-y-4">
            {/* Errores */}
            {errorMessages.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <FiAlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Se encontraron los siguientes errores:
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {errorMessages.map((error, index) => (
                                        <li key={`${error.field}-${index}`}>
                                            {error.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advertencias */}
            {warningMessages.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Advertencias:
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {warningMessages.map((warning, index) => (
                                        <li key={`${warning.field}-${index}`}>
                                            {warning.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidationErrors;
