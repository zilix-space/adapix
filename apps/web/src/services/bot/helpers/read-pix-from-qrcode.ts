import { Jimp } from 'jimp'
import jsQR from 'jsqr';

export async function readPixFromQrCodeFile(file: File): Promise<string | null> {
  try {
    
    // Converte o File para ArrayBuffer e depois para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Processa a imagem com Jimp usando o buffer
    const image = await Jimp.read(buffer);

    // Extrai os dados da imagem
    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
    };
    // Decodifica o QR Code
    const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);
    if (!decodedQR) {
      throw new Error('Nenhum QR Code encontrado na imagem.');
    }
    // Retorna o payload do Pix
    return decodedQR.data;
  } catch (err) {
    console.error('Erro ao processar a imagem:', err);
  }
}
