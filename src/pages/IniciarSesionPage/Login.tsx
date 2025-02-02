import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import Logo from '../../assets/logoInacons.png';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { AppDispatch } from '../../store/store';
import './Login.css';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const setRandomProperties = () => {
      const root = document.documentElement;
      for (let i = 1; i <= 41; i++) {
        root.style.setProperty(`--random${i}`, Math.random().toString());
      }
    };

    setRandomProperties();
    const intervalId = setInterval(setRandomProperties, 15000); // Actualiza cada 15 segundos

    return () => {
      clearInterval(intervalId); // Limpieza al desmontar el componente
      const root = document.documentElement;
      for (let i = 1; i <= 41; i++) {
        root.style.removeProperty(`--random${i}`);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewLoader(true);
    try {
      const resultAction = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/dashboard');
        setErrorMessage('');
      } else {
        setErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
        setViewLoader(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error al iniciar sesión. Intenta de nuevo más tarde.');
      setViewLoader(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden font-[Montserrat] p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-loginRightColor to-loginLeftColor"></div>
      
      <div className="container__background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-8 rounded-[20px] bg-white bg-opacity-20 shadow-lg backdrop-blur-lg border border-white/30 max-w-[350px] w-full md:w-auto">
        <img className="w-full mb-8" src={Logo} alt="Logo" />
        <h1 className="mb-6 mt-2 text-xl font-bold text-center uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-loginLeftTextColor to-loginRightTextColor">
          Bienvenido
        </h1>

        {viewLoader ? (
          <Loader />
        ) : (
          errorMessage && (
            <p className="text-loginErrorTextColor font-bold mb-4 animate-shake">
              {errorMessage}
            </p>
          )
        )}

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mt-2">
          <div className="w-full mb-5 relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Usuario"
              className="w-full p-4 rounded-full border-none bg-white text-base font-light text-loginRightTextColor focus:outline-none focus:shadow-lg transition-shadow"
            />
          </div>

          <div className="relative w-full mb-5">
            <input
              type={mostrarPass ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
              className="w-full p-4 rounded-full border-none bg-white text-base font-light text-loginRightTextColor focus:outline-none focus:shadow-lg transition-shadow"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="focus:outline-none align-middle mr-1"
                >
                  {mostrarPass ? (
                    <FiEyeOff className="h-6 w-6 text-gray-500 cursor-pointer" />
                  ) : (
                    <FiEye className="h-6 w-6 text-gray-500 cursor-pointer" />
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-loginLeftColor to-loginRightColor text-white text-lg font-bold uppercase tracking-wide cursor-pointer transition-all before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-l before:from-loginLeftColor before:to-loginRightColor before:opacity-0 before:transform before:-translate-x-full hover:before:opacity-100 hover:before:translate-x-0 before:transition-all"
          >
            <span className="relative z-10">Iniciar Sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;