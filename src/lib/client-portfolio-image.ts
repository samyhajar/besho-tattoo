"use client";

import { buildProcessedImageName } from "@/lib/portfolio-media";

type SupportedImageOutput = "image/jpeg" | "image/png" | "image/webp";

function getCanvasOutputType(type: string): SupportedImageOutput {
  if (type === "image/jpeg" || type === "image/png" || type === "image/webp") {
    return type;
  }

  return "image/png";
}

async function fileToImageBitmap(file: File) {
  return createImageBitmap(file, {
    imageOrientation: "from-image",
  });
}

async function canvasToFile(params: {
  canvas: HTMLCanvasElement;
  fileName: string;
  type: SupportedImageOutput;
  quality?: number;
}) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    params.canvas.toBlob(
      (generatedBlob) => {
        if (!generatedBlob) {
          reject(new Error("Failed to render the image preview."));
          return;
        }

        resolve(generatedBlob);
      },
      params.type,
      params.quality,
    );
  });

  return new File([blob], params.fileName, { type: params.type });
}

export async function normalizePortfolioImageFile(file: File) {
  const bitmap = await fileToImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas rendering is not available in this browser.");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  return canvasToFile({
    canvas,
    fileName: file.name,
    type: getCanvasOutputType(file.type),
    quality: 0.92,
  });
}

export async function rotatePortfolioImageFile(params: {
  file: File;
  degrees: number;
  outputName?: string;
}) {
  const bitmap = await fileToImageBitmap(params.file);
  const normalizedDegrees = ((params.degrees % 360) + 360) % 360;
  const quarterTurn = normalizedDegrees === 90 || normalizedDegrees === 270;

  const canvas = document.createElement("canvas");
  canvas.width = quarterTurn ? bitmap.height : bitmap.width;
  canvas.height = quarterTurn ? bitmap.width : bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas rendering is not available in this browser.");
  }

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate((normalizedDegrees * Math.PI) / 180);
  context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  bitmap.close();

  return canvasToFile({
    canvas,
    fileName: params.outputName || buildProcessedImageName(params.file.name),
    type: "image/png",
  });
}
