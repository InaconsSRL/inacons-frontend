import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/userActions'
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(loginUser({ username, password }));
               console.log(resultAction);  
	    
            if (loginUser.fulfilled.match(resultAction)) {
		 navigate('/dashboard');
               // const { user } = resultAction.payload;
		//console.log(user);
                //setWelcomeMessage(`¡Bienvenido, ${user.username}!`);
                setErrorMessage('');
            } else {
                setErrorMessage('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error al iniciar sesión. Intenta de nuevo más tarde.');
        }
    };

    return (

        <div>
            <h3>Bienvenidos a InaNet </h3>
            <form onSubmit={handleSubmit}>
            <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
            />
	    <br/>
            <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
            />
	    <br/>
            <button type="submit">Ingresar aqui</button>
        </form>
	 {/*welcomeMessage && <h2>{welcomeMessage}</h2> */}
	{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>	
    );
};

export default Login;
