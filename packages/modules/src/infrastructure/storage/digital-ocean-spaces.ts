import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import axios, { AxiosInstance } from 'axios'

import { randomUUID } from 'crypto'
import { IStorageProvider } from '../../interfaces/providers/storage'

export class DOSpacesStorageProvider implements IStorageProvider {
  client: S3Client
  httpClient: AxiosInstance

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.STORAGE_ENDPOINT as string,
      region: (process.env.STORAGE_REGION as string) || 'ny3',
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY as string,
      },
      apiVersion: 'latest',
      tls: false, // Ignore SSL\
      forcePathStyle: true,
    })

    this.httpClient = axios.create()
  }

  private async convertFileToBuffer(file: File) {
    // Convert file to stream
    const stream = file.stream()

    // Convert stream to buffer
    const chunks = []

    for await (const chunk of stream as any) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    return buffer
  }

  async upload(file: File): Promise<string> {
    const basePath = process.env.STORAGE_PATH
    const extension = file.name.split('.').pop()
    const buffer = await this.convertFileToBuffer(file)
    const fileName = randomUUID() + '.' + extension
    const filePath = basePath + fileName
    const bucket = process.env.STORAGE_BUCKET as string

    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: filePath,
      Body: buffer,
      CacheControl: 'max-age=31536000',
      ACL: 'public-read',
    })

    await this.client.send(command)

    const fullPath = process.env.STORAGE_ENDPOINT + '/' + bucket + filePath
    return fullPath
  }

  async delete(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET as string,
      Key: path,
    })

    await this.client.send(command)
  }
}
