import React, { useState } from 'react';

const CrearPrestamo = () => {
    const [monto, setMonto] = useState('');
    const [fecha, setFecha] = useState('');
    const [cliente, setCliente] = useState('');
    const [tipoPrestamo, setTipoPrestamo] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Aquí se puede agregar la lógica para enviar los datos del préstamo
        console.log({ monto, fecha, cliente, tipoPrestamo });
    };
        e.preventDefault();
        // Aquí se puede agregar la lógica para enviar los datos del préstamo
        console.log({ monto, fecha, cliente, tipoPrestamo });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Monto:</label>
                <input 
                    type="number" 
                    value={monto} 
                    onChange={(e) => setMonto(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Fecha:</label>
                <input 
                    type="date" 
                    value={fecha} 
                    onChange={(e) => setFecha(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Cliente:</label>
                <input 
                    type="text" 
                    value={cliente} 
                    onChange={(e) => setCliente(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Tipo de Préstamo:</label>
                <select 
                    value={tipoPrestamo} 
                    onChange={(e) => setTipoPrestamo(e.target.value)} 
                    required
                >
                    <option value="">Seleccione</option>
                    <option value="personal">Personal</option>
                    <option value="hipotecario">Hipotecario</option>
                    <option value="automovil">Automóvil</option>
                </select>
            </div>
            <button type="submit">Crear Préstamo</button>
        </form>
