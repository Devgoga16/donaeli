/* =========================================================
   DATOS DEL NEGOCIO — edita aquí sin tocar el resto del sitio.
   Todo lo que quede vacío ("" o null) se muestra como "Por confirmar".
   Después de editar, vuelve a publicar (npm run build).
   ========================================================= */
import type { ImageMetadata } from "astro";

import limon from "../assets/ig/limon.jpg";
import bandeja from "../assets/ig/bandeja.jpg";
import huachana from "../assets/ig/huachana.jpg";
import mixta from "../assets/ig/mixta.jpg";
import vitrina from "../assets/ig/vitrina.jpg";
import alfajores from "../assets/ig/alfajores.jpg";
import bebidas from "../assets/ig/bebidas.jpg";
import sabores from "../assets/ig/sabores.jpg";

export const config = {
  // Número de WhatsApp con código de país, solo dígitos. Ej: "51987654321"
  // Si queda vacío, el botón abre WhatsApp para elegir el contacto.
  whatsapp: "",
  instagram: "donaeli_empanadas",
  zona: "Lima Norte",
  direccion: "", // Ej: "Av. ..., Los Olivos"
  horario: "", // Ej: "Lun a Sáb · 9:00 a. m. – 8:00 p. m."
  mapaUrl: "", // Enlace de Google Maps
  entregas: "", // Ej: "Delivery en Los Olivos, Comas e Independencia"
  pagos: "", // Ej: "Yape, Plin y efectivo"
};

export type CategoriaId = "empanadas" | "dulces" | "bebidas";

export const categorias: { id: CategoriaId; nombre: string }[] = [
  { id: "empanadas", nombre: "Empanadas" },
  { id: "dulces", nombre: "Dulces" },
  { id: "bebidas", nombre: "Bebidas" },
];

export interface Producto {
  id: string;
  categoria: CategoriaId;
  nombre: string;
  descripcion: string;
  foto: ImageMetadata;
  etiqueta: string | null;
  precio: number | null; // en soles, ej. 6.5 — null si no está confirmado
}

export const productos: Producto[] = [
  {
    id: "pollo",
    categoria: "empanadas",
    nombre: "Pollo",
    descripcion: "La clásica de siempre, jugosa y horneadita, con su toque de limón.",
    foto: limon,
    etiqueta: "Clásica",
    precio: null,
  },
  {
    id: "carne",
    categoria: "empanadas",
    nombre: "Carne",
    descripcion: "Otra infaltable de la casa: masa artesanal dorada y harto sabor casero.",
    foto: bandeja,
    etiqueta: "Clásica",
    precio: null,
  },
  {
    id: "huachana",
    categoria: "empanadas",
    nombre: "Salchicha Huachana",
    descripcion: "Ábrela y encuéntrate con una deliciosa salchicha huachana. ¡Irresistibleee!",
    foto: huachana,
    etiqueta: "Sabor norteño",
    precio: null,
  },
  {
    id: "mixta",
    categoria: "empanadas",
    nombre: "Mixta",
    descripcion: "La combinación ideal: un bocado crujiente, jugoso y lleno de sabor.",
    foto: mixta,
    etiqueta: "Te va a encantar",
    precio: null,
  },
  {
    id: "queso",
    categoria: "empanadas",
    nombre: "Queso",
    descripcion: "Rellena del delicioso queso huarochirano. ¡Qué ricooo!",
    foto: vitrina,
    etiqueta: "Favorita de los peques",
    precio: null,
  },
  {
    id: "alfajores",
    categoria: "dulces",
    nombre: "Alfajores",
    descripcion: "El bocado perfecto para cerrar el día con una sonrisa.",
    foto: alfajores,
    etiqueta: "Antojo dulce",
    precio: null,
  },
  {
    id: "chicha",
    categoria: "bebidas",
    nombre: "Chicha morada",
    descripcion: "La compañera perfecta de una buena empanada. ¡Perú en cada bocado!",
    foto: bebidas,
    etiqueta: "Bien peruana",
    precio: null,
  },
  {
    id: "jugos",
    categoria: "bebidas",
    nombre: "Jugos",
    descripcion: "Para acompañar tu empanada y completar el mejor plan.",
    foto: sabores,
    etiqueta: null,
    precio: null,
  },
];

export interface Promocion {
  titulo: string;
  detalle?: string;
  precio?: number;
  vigencia?: string;
  productos?: Record<string, number>; // id de producto → cantidad
}

// Si la lista está vacía se muestra un aviso invitando a seguir el Instagram. Ejemplo:
// { titulo: "Combo familiar", detalle: "6 empanadas + 1 jarra de chicha", precio: 39, vigencia: "Solo sábados", productos: { pollo: 3, carne: 3, chicha: 1 } }
export const promociones: Promocion[] = [];

/* ---------- Utilidades compartidas ---------- */
export const waNumber = config.whatsapp.replace(/\D/g, "");
export const waUrl = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
export const waSaludo = waUrl("¡Hola Doña Eli! 👋 Quiero hacer un pedido de empanadas.");
export const instagramUrl = `https://www.instagram.com/${config.instagram}/`;
export const money = (n: number) => "S/ " + n.toFixed(2);
export const nombrePedido = (p: Pick<Producto, "categoria" | "nombre">) =>
  p.categoria !== "empanadas" ? p.nombre : p.nombre === "Mixta" ? "Empanada mixta" : `Empanada de ${p.nombre}`;
