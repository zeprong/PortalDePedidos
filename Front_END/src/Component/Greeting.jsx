import React, { useContext } from 'react';
import { AuthContext } from '../config/AuthContext';

const obtenerDiaActual = () => {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[new Date().getDay()];
};

const obtenerSaludoPorHora = () => {
  const hora = new Date().getHours();
  if (hora < 12) return '¡Buenos días';
  if (hora < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
};

const obtenerEmojiPorHora = () => {
  const hora = new Date().getHours();
  if (hora < 12) return '🌞';
  if (hora < 18) return '🌤️';
  return '🌙';
};

const frasesMotivacionales = [
  "Recuerda que cada día es una nueva oportunidad para lograr tus metas.",
  "¡Hoy puede ser un gran día para aprender algo nuevo!",
  "Sigue adelante, tu esfuerzo dará frutos.",
  "La actitud positiva es el primer paso hacia el éxito.",
  "¡Confía en ti, puedes lograrlo!",
  "Haz de este día uno memorable.",
  "Sonríe, ¡hoy es tu día!",
];

const obtenerFraseAleatoria = () => {
  return frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)];
};

const Greeting = () => {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  const nombre = user.nombre || user.username || 'usuario';

  return (
    <div className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 border-l-8 border-blue-400 text-blue-900 p-6 mb-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto flex items-center gap-6 animate-fade-in">
      <div className="flex-shrink-0 text-5xl select-none" aria-label="Saludo">
        {obtenerEmojiPorHora()}
      </div>
      <div>
        <p className="text-2xl font-extrabold mb-1">
          {obtenerSaludoPorHora()}, <span className="capitalize">{nombre}</span> 👋
        </p>
        <p className="text-base text-blue-700 mb-2">
          Hoy es <span className="font-semibold">{obtenerDiaActual()}</span>. ¡Esperamos que tengas un día increíble!
        </p>
        <div className="bg-white/70 rounded px-3 py-2 mt-2 shadow-inner text-blue-800 text-sm italic border-l-4 border-blue-200">
          {obtenerFraseAleatoria()}
        </div>
      </div>
    </div>
  );
};

export default Greeting;
