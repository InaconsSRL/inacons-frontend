import React, { useState } from 'react';
import GuiaTransfer from './Recepcion de Transferencias/GuiaTransfer';

const RecepcionTransferencia = () => {
    return (
        <div className="container">
            <h1>TRANSFERENCIAS A OTRAS ORAS</h1>
            <div className="transferencia-card">
                <h2>N° de orden de Transferencia</h2>
                <p>Almacen de Salida:</p>
                <p>Estado: En camino</p>
                <p>observaciones:</p>
                <p>Tipo de transporte:</p>
                <button className="btn-recepcionar">Recepcionar</button>
                <button className="btn-ver-detalles">Ver Detalles</button>
            </div>
            <div className="transferencia-card">
                <h2>N° de orden de Transferencia</h2>
                <p>Almacen de Salida:</p>
                <p>Estado: Completado</p>
                <p>observaciones:</p>
                <p>Tipo de transporte:</p>
                <button className="btn-ver-detalles">Ver Detalles</button>
            </div>
            <div className="transferencia-card">
                <h2>N° de orden de Transferencia</h2>
                <p>Almacen de Salida:</p>
                <p>Estado: Completado</p>
                <p>observaciones:</p>
                <p>Tipo de transporte:</p>
                <button className="btn-ver-detalles">Ver Detalles</button>
            </div>
        </div>
    );
};

export default RecepcionTransferencia;
