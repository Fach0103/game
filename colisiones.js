
export function colisiona(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export const battlefield = {
  x: (800 - 424) / 2,
  y: 420,
  width: 424,
  height: 180,
  imagen: new Image()
};
battlefield.imagen.src = "falcon/Battlefield.png";

export const plataformas = [
  {
    x: 250,
    y: 230,
    width: 100,
    height: 30,
    imagen: new Image()
  },
  {
    x: 400,
    y: 230,
    width: 100,
    height: 30,
    imagen: new Image()
  },
  {
    x: 325,
    y: 180,
    width: 100,
    height: 30,
    imagen: new Image()
  }
];

plataformas[0].imagen.src = "falcon/Plataforma1.png";
plataformas[1].imagen.src = "falcon/Plataforma2.png";
plataformas[2].imagen.src = "falcon/Plataforma3.png";
