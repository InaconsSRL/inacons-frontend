import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { addPresupuesto, updatePresupuesto } from '../../../slices/presupuestoSlice';
import { IPresupuesto } from '../../../types/PresupuestosTypes';

interface FormularioPresupuestoProps {
    presupuesto?: IPresupuesto | null;
    id_proyecto: string;
    onClose: () => void;
    cantidadPresupuestos: number;
}

interface FormState {
    nombre_presupuesto: string;
    costo_directo: string;
    ppto_base: string;
    ppto_oferta: string;
    observaciones: string;
    monto_igv: string;
    monto_utilidad: string;
    parcial_presupuesto: string;
    plazo: string;
    porcentaje_igv: string;
    porcentaje_utilidad: string;
    total_presupuesto: string;
    numeracion_presupuesto?: number;
}

interface InputFieldProps {
    label: string;
    name: keyof FormState;
    type?: string;
    min?: number;
    max?: number;
    step?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Componente InputField memorizado
const InputField = memo(({ 
    label, 
    name, 
    type = "text", 
    min, 
    max, 
    step,
    required = false,
    value,
    onChange
}: InputFieldProps) => (
    <label className="block">
        <span className="text-xs sm:text-sm md:text-sm font-medium text-gray-300 mb-1 md:mb-2 block">
            {label}
        </span>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/70 border border-gray-700 rounded-md 
                     text-sm md:text-base text-gray-200 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition duration-200"
            min={min}
            max={max}
            step={step}
            required={required}
        />
    </label>
));

InputField.displayName = 'InputField';

const FormularioPresupuesto: React.FC<FormularioPresupuestoProps> = ({
    presupuesto,
    id_proyecto,
    onClose,
    cantidadPresupuestos
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const actionStatus = useSelector((state: RootState) => state.presupuesto.loading);

    const [formData, setFormData] = useState<FormState>({
        nombre_presupuesto: '',
        costo_directo: '0',
        ppto_base: '0',
        ppto_oferta: '0',
        observaciones: '',
        monto_igv: '0',
        monto_utilidad: '0',
        parcial_presupuesto: '0',
        plazo: '0',
        porcentaje_igv: '18',
        porcentaje_utilidad: '0',
        total_presupuesto: '0',
        numeracion_presupuesto: presupuesto 
            ? presupuesto.numeracion_presupuesto 
            : cantidadPresupuestos + 1, // Esto ahora usará la cantidad correcta del proyecto actual
    });

    useEffect(() => {
        if (presupuesto) {
            setFormData({
                nombre_presupuesto: presupuesto.nombre_presupuesto || '',
                costo_directo: presupuesto.costo_directo?.toString() || '0',
                ppto_base: presupuesto.ppto_base?.toString() || '0',
                ppto_oferta: presupuesto.ppto_oferta?.toString() || '0',
                observaciones: presupuesto.observaciones || '',
                monto_igv: presupuesto.monto_igv?.toString() || '0',
                monto_utilidad: presupuesto.monto_utilidad?.toString() || '0',
                parcial_presupuesto: presupuesto.parcial_presupuesto?.toString() || '0',
                plazo: presupuesto.plazo?.toString() || '0',
                porcentaje_igv: presupuesto.porcentaje_igv?.toString() || '18',
                porcentaje_utilidad: presupuesto.porcentaje_utilidad?.toString() || '0',
                total_presupuesto: presupuesto.total_presupuesto?.toString() || '0',
            });
        }
    }, [presupuesto]);

    // Memorizar handleChange
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumericField = name.includes('costo') || 
                              name.includes('ppto') || 
                              name.includes('plazo') || 
                              name.includes('porcentaje');

        if (isNumericField) {
            const numericValue = value.replace(/[^0-9.]/g, '');
            if (numericValue.split('.').length <= 2) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numericData = {
            ...formData,
            costo_directo: parseFloat(formData.costo_directo) || 0,
            ppto_base: parseFloat(formData.ppto_base) || 0,
            ppto_oferta: parseFloat(formData.ppto_oferta) || 0,
            monto_igv: parseFloat(formData.monto_igv) || 0,
            monto_utilidad: parseFloat(formData.monto_utilidad) || 0,
            parcial_presupuesto: parseFloat(formData.parcial_presupuesto) || 0,
            plazo: parseInt(formData.plazo) || 0,
            porcentaje_igv: parseFloat(formData.porcentaje_igv) || 18,
            porcentaje_utilidad: parseFloat(formData.porcentaje_utilidad) || 0,
            total_presupuesto: parseFloat(formData.total_presupuesto) || 0,
            numeracion_presupuesto: formData.numeracion_presupuesto || 1
        };

        try {
            if (presupuesto) {
                await dispatch(updatePresupuesto({
                    ...presupuesto,
                    ...numericData
                })).unwrap();
            } else {
                await dispatch(addPresupuesto({
                    ...numericData,
                    id_proyecto
                })).unwrap();
            }
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const isLoading = actionStatus === true;

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900/70 p-4 sm:p-6 md:p-8 rounded-lg max-w-4xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <InputField
                        label="Nombre del Presupuesto"
                        name="nombre_presupuesto"
                        required
                        value={formData.nombre_presupuesto}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                        <InputField
                            label="Costo Directo (S/.)"
                            name="costo_directo"
                            type="number"
                            step="0.01"
                            value={formData.costo_directo}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Presupuesto Base (S/.)"
                            name="ppto_base"
                            type="number"
                            step="0.01"
                            value={formData.ppto_base}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Plazo (días)"
                            name="plazo"
                            type="number"
                            min={1}
                            value={formData.plazo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <InputField
                            label="Presupuesto Oferta (S/.)"
                            name="ppto_oferta"
                            type="number"
                            step="0.01"
                            value={formData.ppto_oferta}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Porcentaje IGV (%)"
                            name="porcentaje_igv"
                            type="number"
                            step="0.01"
                            min={0}
                            max={100}
                            value={formData.porcentaje_igv}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Porcentaje Utilidad (%)"
                            name="porcentaje_utilidad"
                            type="number"
                            step="0.01"
                            min={0}
                            max={100}
                            value={formData.porcentaje_utilidad}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block">
                        <span className="text-xs sm:text-sm md:text-sm font-medium text-gray-300 mb-1 md:mb-2 block">
                            Observaciones
                        </span>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800 border border-gray-700 rounded-md 
                                     text-sm md:text-base text-gray-200 placeholder-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     transition duration-200 resize-none"
                        />
                    </label>
                </div>
            </div>

            <div className="mt-6 sm:mt-8 border-t border-gray-800 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 text-sm md:text-base bg-gray-800 text-gray-300 rounded-md 
                                 hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 
                                 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto px-4 py-2 text-sm md:text-base bg-blue-600 text-white rounded-md 
                                 hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Guardando...' : presupuesto ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormularioPresupuesto;