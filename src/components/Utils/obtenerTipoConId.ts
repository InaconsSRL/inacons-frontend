import { useSelector } from 'react-redux';
import { RootState } from "../../store/store";

export const useObtenerTipoConId = (id: string) => {
    const {tiposRecurso} = useSelector((state: RootState) => state.tipoRecurso);
    return tiposRecurso.find((tipo) => tipo.id === id);
}