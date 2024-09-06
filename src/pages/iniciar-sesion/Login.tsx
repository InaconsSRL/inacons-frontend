import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/userActions';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../components/Icons/solid/EyeIcon';
import EyeSlashIcon from '../../components/Icons/solid/EyeSlashIcon';
import Loader from '../../components/Loader/Loader';
import Logo from '../../assets/logo.svg'

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-loginRightColor to-loginLeftColor font-[Montserrat] p-4">
      <div className="flex flex-col items-center p-8 rounded-[20px] bg-white bg-opacity-20 shadow-lg backdrop-blur-lg border border-white/30 max-w-[350px] w-full md:w-auto">
        <img className="w-full mb-8" src={Logo} alt="Logo" />
        <h1 className="mb-6 mt-2 text-xl font-bold text-center uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-loginLeftTextColor to-loginRightTextColor">
          Iniciar Sesión
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
                    <EyeSlashIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                  ) : (
                    <EyeIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className=
            "mt-4 relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-loginLeftColor to-loginRightColor text-white text-lg font-bold uppercase tracking-wide cursor-pointer transition-all before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-l before:from-loginLeftColor before:to-loginRightColor before:opacity-0 before:transform before:-translate-x-full hover:before:opacity-100 hover:before:translate-x-0 before:transition-all"
          >
            <span className="relative z-10">Iniciar Sesión</span>
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;
