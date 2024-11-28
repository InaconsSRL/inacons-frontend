import { useSelector } from 'react-redux';

import { RootState } from "../../store/store";

export const useObtenerUnidadConId = (id: string) => {
    const unidades = useSelector((state: RootState) => state.unidad.unidades);
    return unidades.find((unidad) => unidad.id === id);
}