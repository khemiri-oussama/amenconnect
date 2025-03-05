import type SignatureCanvas from "react-signature-canvas";

declare global {
  interface Window {
    SignatureCanvas: typeof SignatureCanvas;
  }
}

export {};
