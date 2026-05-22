declare module "gif.js" {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    repeat?: number;
    background?: string;
    transparent?: string | null;
  }
  interface FrameOptions {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  }
  class GIF {
    constructor(options: GIFOptions);
    addFrame(image: HTMLCanvasElement | CanvasRenderingContext2D | HTMLImageElement, options?: FrameOptions): void;
    render(): void;
    on(event: "finished", cb: (blob: Blob) => void): void;
    on(event: "progress", cb: (p: number) => void): void;
  }
  export default GIF;
}
