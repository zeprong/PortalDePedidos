import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../config/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Greeting from './Greeting';

export default function SellerStats() {
  const { user } = useContext(AuthContext);
  const [resumen, setResumen] = useState(null);
  const [dataPorMes, setDataPorMes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cotizaciones/resumen`);
        setResumen(data);
        setDataPorMes(data?.porMes || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el resumen.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-xl shadow p-6 mt-8 max-w-md mx-auto">
        <span className="text-2xl text-gray-400 mb-2">🔒</span>
        <p className="text-gray-600 text-center">Por favor inicia sesión para ver tu resumen.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-xl shadow p-6 mt-8 max-w-md mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-4"></div>
        <span className="text-blue-700 font-semibold">Cargando resumen...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-white rounded-xl shadow p-6 mt-8 max-w-md mx-auto">
        <span className="text-2xl text-red-400 mb-2">⚠️</span>
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  const totalCotizacionesUsuario = resumen.porVendedor?.[user.nombre] || 0;
  const valorTotal = resumen.valorTotal || 0;
  const totalClientes = resumen.totalClientes || 0;

  const estadosGlobal = Object.entries(resumen.porEstado || {}).map(([estado, cantidad]) => ({
    estado,
    cantidad,
  }));

  return (
    <section className="w-full px-4 max-w-5xl mx-auto mt-8 font-sans">
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col gap-6">
        
        {/* Saludo personalizado */}
        <Greeting />

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <KPIBox
            color="blue"
            label="Tus Cotizaciones"
            value={totalCotizacionesUsuario}
          />
          <KPIBox
            color="green"
            label="Valor total (global)"
            value={valorTotal.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
            })}
          />
          <KPIBox
            color="yellow"
            label="Clientes únicos (global)"
            value={totalClientes}
          />
        </div>

        {/* Gráfico por estado */}
        <ChartCard title="📈 Cotizaciones por estado (Global)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadosGlobal} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" tick={{ fontSize: 14 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" barSize={40} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico mensual por estado */}
        {dataPorMes.length > 0 && (
          <ChartCard title="📊 Evolución mensual por estado (Datos reales)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dataPorMes} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Pendiente" stackId="a" fill="#facc15" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Aprobada" stackId="a" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Rechazada" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </section>
  );
}

function KPIBox({ color, label, value }) {
  const colorMap = {
    blue: { border: 'border-blue-500', text: 'text-blue-700' },
    green: { border: 'border-green-500', text: 'text-green-700' },
    yellow: { border: 'border-yellow-500', text: 'text-yellow-700' },
  };

  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-8 ${colorMap[color].border} flex flex-col justify-center`}>
      <span className={`text-4xl font-extrabold ${colorMap[color].text}`}>{value}</span>
      <span className="text-gray-600 mt-1 uppercase tracking-wide text-xs sm:text-sm">{label}</span>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
