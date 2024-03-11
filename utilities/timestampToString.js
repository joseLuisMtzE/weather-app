const TimestampToString = (timestamp) => {
  // Multiplicamos por 1000 para convertir el timestamp de segundos a milisegundos
  const fecha = new Date(timestamp * 1000);

  // Puedes ajustar el formato según tus preferencias utilizando los métodos de Date
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return fecha.toLocaleString("es-ES", options);
};

export default TimestampToString;
