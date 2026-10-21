/* =========================================================
   DATOS DEL NEGOCIO — edita aquí sin tocar el resto del sitio.
   Todo lo marcado como null / "" se muestra como "Por confirmar".
   ========================================================= */

window.DONA_ELI = {
  config: {
    // Número de WhatsApp con código de país, solo dígitos. Ej: "51987654321"
    // Si queda vacío, el botón abre WhatsApp para elegir el contacto.
    whatsapp: "",
    instagram: "donaeli_empanadas",
    zona: "Lima Norte",
    direccion: "",      // Ej: "Av. ..., Los Olivos"
    horario: "",        // Ej: "Lun a Sáb · 9:00 a. m. – 8:00 p. m."
    mapaUrl: "",        // Enlace de Google Maps
    entregas: "",       // Ej: "Delivery en Los Olivos, Comas e Independencia"
    pagos: ""           // Ej: "Yape, Plin y efectivo"
  },

  categorias: [
    { id: "empanadas", nombre: "Empanadas" },
    { id: "dulces", nombre: "Dulces" },
    { id: "bebidas", nombre: "Bebidas" }
  ],

  // precio: número en soles (ej. 6.5) o null si aún no está confirmado.
  productos: [
    {
      id: "pollo",
      categoria: "empanadas",
      nombre: "Pollo",
      descripcion: "La clásica de siempre, jugosa y horneadita, con su toque de limón.",
      foto: "img/ig/limon.jpg",
      etiqueta: "Clásica",
      precio: null
    },
    {
      id: "carne",
      categoria: "empanadas",
      nombre: "Carne",
      descripcion: "Otra infaltable de la casa: masa artesanal dorada y harto sabor casero.",
      foto: "img/ig/bandeja.jpg",
      etiqueta: "Clásica",
      precio: null
    },
    {
      id: "huachana",
      categoria: "empanadas",
      nombre: "Salchicha Huachana",
      descripcion: "Ábrela y encuéntrate con una deliciosa salchicha huachana. ¡Irresistibleee!",
      foto: "img/ig/huachana.jpg",
      etiqueta: "Sabor norteño",
      precio: null
    },
    {
      id: "mixta",
      categoria: "empanadas",
      nombre: "Mixta",
      descripcion: "La combinación ideal: un bocado crujiente, jugoso y lleno de sabor.",
      foto: "img/ig/mixta.jpg",
      etiqueta: "Te va a encantar",
      precio: null
    },
    {
      id: "queso",
      categoria: "empanadas",
      nombre: "Queso",
      descripcion: "Rellena del delicioso queso huarochirano. ¡Qué ricooo!",
      foto: "img/ig/vitrina.jpg",
      etiqueta: "Favorita de los peques",
      precio: null
    },
    {
      id: "alfajores",
      categoria: "dulces",
      nombre: "Alfajores",
      descripcion: "El bocado perfecto para cerrar el día con una sonrisa.",
      foto: "img/ig/alfajores.jpg",
      etiqueta: "Antojo dulce",
      precio: null
    },
    {
      id: "chicha",
      categoria: "bebidas",
      nombre: "Chicha morada",
      descripcion: "La compañera perfecta de una buena empanada. ¡Perú en cada bocado!",
      foto: "img/ig/bebidas.jpg",
      etiqueta: "Bien peruana",
      precio: null
    },
    {
      id: "jugos",
      categoria: "bebidas",
      nombre: "Jugos",
      descripcion: "Para acompañar tu empanada y completar el mejor plan.",
      foto: "img/ig/sabores.jpg",
      etiqueta: null,
      precio: null
    }
  ],

  // Promociones y campañas. Si la lista está vacía se muestra un aviso
  // invitando a seguir el Instagram. Ejemplo de formato:
  // { titulo: "Combo familiar", detalle: "6 empanadas + 1 jarra de chicha", precio: 39, vigencia: "Solo sábados", productos: { pollo: 3, carne: 3, chicha: 1 } }
  promociones: []
};
