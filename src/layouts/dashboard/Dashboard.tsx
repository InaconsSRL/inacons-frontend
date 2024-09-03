import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {RootState} from '../../store/store';
const Dashboard: React.FC = () => {    const user = useSelector((state: RootState) => state.user);
 
    return (
        <div>
            <header>
                <h1>Bienvenido, {user.username ? user.username : 'Usuario'}</h1> 
                <nav>
                    <ul>
                        <li>
                            <Link to="/usuarios">Usuarios</Link>
                        </li>
                       
                    </ul>
                </nav>
            </header>
            <main>
            <Outlet /> {/* archivos hijo */} 
            </main>
        </div>
    );
};

export default Dashboard;
