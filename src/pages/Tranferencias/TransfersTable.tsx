
interface Transfer {
  code: string;
  user: string;
  date: string;
  status: string;
  reference: string;
  transport: string;
}

const mockTransfers: Transfer[] = [
  {
    code: "874563",
    user: "U.envia",
    date: "12/02/2024",
    status: "enviado",
    reference: "Transferencia",
    transport: "Encomienda",
  },
  {
    code: "874564",
    user: "U.recibe",
    date: "13/02/2024",
    status: "recibido",
    reference: "Pago",
    transport: "Paquete",
  },
  {
    code: "874565",
    user: "U.envia",
    date: "14/02/2024",
    status: "enviado",
    reference: "Transferencia",
    transport: "Encomienda",
  },
];

export function TransferTable() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transferencias</h2>
      </div>

      <div className="w-full">
        <div className="grid w-[250px] grid-cols-2">
          <button className="bg-navy-800 data-[state=active]:bg-navy-900">
            Solicitudes
          </button>
          <button className="bg-green-600 text-white">
            Enviados
          </button>
        </div>

        <table className="min-w-full mt-4 border">
          <thead>
            <tr className="bg-gray-50">
              <th className="font-semibold p-2 text-left">Código</th>
              <th className="font-semibold p-2 text-left">Usuario</th>
              <th className="font-semibold p-2 text-left">Fecha</th>
              <th className="font-semibold p-2 text-left">Estado</th>
              <th className="font-semibold p-2 text-left">Referencia</th>
              <th className="font-semibold p-2 text-left">Transporte</th>
              <th className="font-semibold p-2 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mockTransfers.map((transfer, index) => (
              <tr key={index}>
                <td className="p-2">{transfer.code}</td>
                <td className="p-2">{transfer.user}</td>
                <td className="p-2">{transfer.date}</td>
                <td className="p-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {transfer.status}
                  </span>
                </td>
                <td className="p-2">{transfer.reference}</td>
                <td className="p-2">{transfer.transport}</td>
                <td className="p-2">
                  <button className="bg-transparent border-none text-blue-600">
                    <span className="material-icons">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
