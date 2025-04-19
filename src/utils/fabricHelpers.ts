import { util, type InteractiveFabricObject } from "fabric";

export function renderDeleteControl(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  _: any, // skip this argument
  fabricObject: InteractiveFabricObject,
) {
  const size = 10;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(util.degreesToRadians(fabricObject.angle));

  // Draw circular border
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, size / 2 + 3, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw X
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-size / 3, -size / 3);
  ctx.lineTo(size / 3, size / 3);
  ctx.moveTo(size / 3, -size / 3);
  ctx.lineTo(-size / 3, size / 3);
  ctx.stroke();

  ctx.restore();
}
