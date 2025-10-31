
import { colisiona, battlefield, plataformas } from "./colisiones.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const spriteQuietoDerecha = new Image();
spriteQuietoDerecha.src = "falcon/sprite-0001.png";

const spriteQuietoIzquierda = new Image();
spriteQuietoIzquierda.src = "falcon/sprite-0002.png";

const spriteSalto = new Image();
spriteSalto.src = "falcon/Jump-0001.png";

const runFrames = [];
for (let i = 3; i <= 8; i++) {
  const img = new Image();
  img.src = `falcon/Run-000${i}.png`;
  runFrames.push(img);
}

const animaciones = {
  quieto: {
    frames: [spriteQuietoDerecha, spriteQuietoIzquierda],
    ancho: 49,
    alto: 63
  },
  correr: {
    frames: runFrames,
    ancho: 75,
    alto: 80
  },
  salto: {
    frames: [spriteSalto],
    ancho: 43,
    alto: 78
  }
};

let tipo = "quieto";
let posicionX = battlefield.x + (battlefield.width - animaciones.quieto.ancho) / 2;
let personajeY = battlefield.y - animaciones.quieto.alto;
let velocidadX = 10;
let direccion = 1;
let flechaDerecha = false;
let flechaIzquierda = false;
let fotograma = 0;

let velocidadY = 0;
let gravedad = 1.5;
let impulsoSalto = -20;
let enElAire = false;

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(battlefield.imagen, battlefield.x, battlefield.y, battlefield.width, battlefield.height);
  plataformas.forEach((plataforma) => {
    ctx.drawImage(plataforma.imagen, plataforma.x, plataforma.y, plataforma.width, plataforma.height);
  });

  tipo = enElAire
    ? "salto"
    : flechaDerecha || flechaIzquierda
    ? "correr"
    : "quieto";

  const anim = animaciones[tipo];
  const frame =
    tipo === "quieto"
      ? direccion === 1
        ? anim.frames[0]
        : anim.frames[1]
      : anim.frames[fotograma % anim.frames.length];

  if (enElAire) {
    velocidadY += gravedad;
    personajeY += velocidadY;
  }

  const sueloY = battlefield.y - anim.alto;
  if (personajeY >= sueloY) {
    personajeY = sueloY;
    velocidadY = 0;
    enElAire = false;
  }

  if (tipo === "correr") {
    ctx.save();
    ctx.translate(posicionX + anim.ancho / 2, personajeY + anim.alto / 2);
    ctx.scale(direccion, 1);
    ctx.drawImage(frame, 0, 0, anim.ancho, anim.alto, -anim.ancho / 2, -anim.alto / 2, anim.ancho, anim.alto);
    ctx.restore();
  } else {
    ctx.drawImage(frame, posicionX, personajeY, anim.ancho, anim.alto);
  }

  if (tipo === "correr") {
    fotograma = (fotograma + 1) % anim.frames.length;

    if (flechaDerecha && posicionX + anim.ancho < canvas.width) {
      posicionX += velocidadX;
    }
    if (flechaIzquierda && posicionX > 0) {
      posicionX -= velocidadX;
    }
  }

  const personajeBox = {
    x: posicionX,
    y: personajeY,
    width: anim.ancho,
    height: anim.alto
  };

  if (colisiona(personajeBox, battlefield)) {
    if (flechaDerecha) posicionX -= velocidadX;
    if (flechaIzquierda) posicionX += velocidadX;
  }

  plataformas.forEach((plataforma) => {
    if (colisiona(personajeBox, plataforma)) {
      const estaEncima = personajeY + personajeBox.height <= plataforma.y + 5;
      if (!estaEncima) {
        if (flechaDerecha) posicionX -= velocidadX;
        if (flechaIzquierda) posicionX += velocidadX;
      }
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    flechaDerecha = true;
    direccion = 1;
  }
  if (e.key === "ArrowLeft") {
    flechaIzquierda = true;
    direccion = -1;
  }
  if (e.key === "z" && !enElAire) {
    if (flechaDerecha) direccion = 1;
    if (flechaIzquierda) direccion = -1;

    velocidadY = impulsoSalto;
    enElAire = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") flechaDerecha = false;
  if (e.key === "ArrowLeft") flechaIzquierda = false;
});

setInterval(animar, 60);
