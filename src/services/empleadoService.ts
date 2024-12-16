import { gql } from '@apollo/client';
import client from '../apolloClient'; 

export const LIST_EMPLEADOS = gql`
  query ListEmpleados {
    listEmpleados {
      apellidos
      cargo {
        nombre
        id
        gerarquia
        descripcion
      }
      id
      nombres
      telefono
      telefono_secundario
    }
  }
`;

export const fetchEmpleados = async () => {
  const { data } = await client.query({
    query: LIST_EMPLEADOS,
  });
  return data.listEmpleados.map((empleado: any) => ({
    id: empleado.id,
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    telefono: empleado.telefono,
    telefono_secundario: empleado.telefono_secundario,
    cargo: {
      nombre: empleado.cargo.nombre,
      id: empleado.cargo.id,
      gerarquia: empleado.cargo.gerarquia,
      descripcion: empleado.cargo.descripcion,
    },
  }));
};