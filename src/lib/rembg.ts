const REMBG_API_URL = "https://api.rembg.com/rmbg";

export class RembgError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RembgError";
    this.status = status;
  }
}

type RemoveImageBackgroundParams = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

type RembgErrorPayload = {
  error?: string;
};

function getRembgApiKey(): string {
  const apiKey = process.env.REMBG_API_KEY;

  if (!apiKey) {
    throw new RembgError(
      "Background removal is not configured. Add REMBG_API_KEY to the server environment.",
      500,
    );
  }

  return apiKey;
}

async function getRembgErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as RembgErrorPayload;
      if (payload.error) {
        return payload.error;
      }
    } catch {
      // Fall through to generic messages below.
    }
  }

  try {
    const text = await response.text();
    if (text) {
      return text;
    }
  } catch {
    // Ignore parse errors and use the generic fallback below.
  }

  return "The background removal request failed.";
}

function normalizeRembgError(status: number, message: string): RembgError {
  if (status === 400) {
    return new RembgError(message, 400);
  }

  if (status === 401) {
    return new RembgError(
      "Background removal credentials are invalid. Check REMBG_API_KEY.",
      500,
    );
  }

  if (status === 403) {
    return new RembgError(
      "Background removal is blocked for this API key. Verify the rembg account email and account status.",
      502,
    );
  }

  if (status === 429) {
    return new RembgError(
      "Background removal is temporarily rate limited. Please try again in a moment.",
      429,
    );
  }

  return new RembgError(
    "Background removal is temporarily unavailable. Please try again later.",
    502,
  );
}

export async function removeImageBackground({
  buffer,
  contentType,
  filename,
}: RemoveImageBackgroundParams): Promise<Buffer> {
  const formData = new FormData();
  formData.append("image", new Blob([buffer], { type: contentType }), filename);
  formData.append("format", "png");
  formData.append("bg_color", "#000000ff");

  const response = await fetch(REMBG_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": getRembgApiKey(),
    },
    body: formData,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getRembgErrorMessage(response);
    throw normalizeRembgError(response.status, message);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
