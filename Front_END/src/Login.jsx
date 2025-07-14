import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import logo from '../src/assets/logo.png';
import slogan from './assets/tex.png';
import { AuthContext } from './config/AuthContext'; // <-- IMPORTANTE

const Login = () => {

  const { setUser } = useContext(AuthContext); // <-- IMPORTANTE
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const camposValidos = usuario.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!camposValidos) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', { usuario, password });
      console.log(data);
      const { token, rol, nombre, id_usuario, documento, correo, imagen_url } = data;

      if (token && rol) {
        const userData = {
          id_usuario,
          nombre,
          documento: documento || 'N/A',
          usuario,
          rol,
          correo: correo,
          avatar: imagen_url || 'https://i.pravatar.cc/100',
          estado: 'activo',
        };

        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(userData));
        localStorage.setItem('rol', rol);
        setUser(userData);

        // Redirección a dashboard admin
        navigate('/dashboard/admin');
      } else {
        setError('Respuesta del servidor inválida');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Usuario o contraseña incorrectos');
      } else {
        setError('Error inesperado, intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white shadow-md p-2 mb-4">
            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <img src={slogan}alt="Logo" className="w-48 h-15 object-contain rounded-full" />
        </div>

        <div className="space-y-6">
          {/* Input Usuario */}
          <div className="group">
            <label htmlFor="usuario" className="block text-sm font-medium text-green-900 mb-2">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-green-900" />
              </div>
              <input
                id="usuario"
                type="text"
                placeholder="Usuario corporativo"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 text-emerald-800 focus:border-green-900 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-green-900 mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-green-900" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 text-emerald-800 focus:border-green-900 focus:outline-none bg-transparent placeholder-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Botón Ingresar */}
          <button
            onClick={handleLogin}
            disabled={loading || !camposValidos}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-green-800 text-white shadow-sm hover:bg-green-900 hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Validando...</span>
              </>
            ) : (
              <span>Ingresar al sistema</span>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <button className="hover:text-green-900 hover:underline transition-colors">
            ¿Problemas para ingresar?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;




