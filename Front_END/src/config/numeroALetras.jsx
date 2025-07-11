export function limpiarNumero(valor) {
    if (typeof valor === 'number') return valor;
    return Number(
      String(valor)
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '')
        .trim()
    );
  }
  
  export default function numeroALetras(valor) {
    if (isNaN(valor)) return '';
  
    const UNIDADES = [
      '', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO',
      'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
      'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE',
      'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE'
    ];
  
    const DECENAS = [
      '', '', 'VEINTE', 'TREINTA', 'CUARENTA',
      'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'
    ];
  
    const CENTENAS = [
      '', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS',
      'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
    ];
  
    function convertir999(n) {
      let resultado = '';
      if (n === 0) return '';
  
      if (n > 99) {
        const centenas = Math.floor(n / 100);
        resultado += (centenas === 1 && n % 100 === 0) ? 'CIEN' : CENTENAS[centenas];
        n %= 100;
        if (n > 0) resultado += ' ';
      }
  
      if (n <= 20) {
        resultado += UNIDADES[n];
      } else {
        const decenas = Math.floor(n / 10);
        resultado += DECENAS[decenas];
        const unidades = n % 10;
        if (unidades > 0) resultado += ' Y ' + UNIDADES[unidades];
      }
  
      return resultado.trim();
    }
  
    function convertir(num) {
      let millones = Math.floor(num / 1000000);
      let miles = Math.floor((num % 1000000) / 1000);
      let resto = num % 1000;
  
      let partes = [];
      if (millones === 1) partes.push('UN MILLÓN');
      else if (millones > 1) partes.push(convertir999(millones) + ' MILLONES');
  
      if (miles === 1) partes.push('MIL');
      else if (miles > 1) partes.push(convertir999(miles) + ' MIL');
  
      if (resto > 0) partes.push(convertir999(resto));
  
      return partes.join(' ');
    }
  
    valor = Math.floor(limpiarNumero(valor));
    if (valor === 0) return 'CERO PESOS M/CTE';
  
    return convertir(valor).trim() + ' PESOS M/CTE';
  }
  