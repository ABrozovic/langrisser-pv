import { DB } from '@/components/store/spine'
import axios, { AxiosResponse } from 'axios'
import { Buffer } from 'buffer'

const REPO_URL = import.meta.env.VITE_REPO_URL

export const fetchDB = async () => {
  try {
    const response = await axios.get(REPO_URL + '/data.json')

    return response.data as DB
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}

export const fetchFilesUrls = async (files: {
  atlas: string
  png: string
  skel: string
}) => {
  const filePromises: Promise<AxiosResponse<string, ArrayBuffer>>[] = [
    axios.get(REPO_URL + files.atlas, {
      responseType: 'arraybuffer',
    }),
    axios.get(REPO_URL + files.png, {
      responseType: 'arraybuffer',
    }),
    axios.get(REPO_URL + files.skel, {
      responseType: 'arraybuffer',
    }),
  ]

  const fetchedFiles: {
    atlasUrl: string
    imageUrl: string
    skelUrl: string
  } = { atlasUrl: '', imageUrl: '', skelUrl: '' }

  const responses = await Promise.all(filePromises)

  responses.forEach((response, index) => {
    const mimeType = response.headers['content-type']
    const buffer = Buffer.from(response.data, 'binary')
    const dataURL = `data:${mimeType};base64,${buffer.toString('base64')}`

    if (index === 0) {
      fetchedFiles.atlasUrl = dataURL
    } else if (index === 1) {
      fetchedFiles.imageUrl = dataURL
    } else if (index === 2) {
      fetchedFiles.skelUrl = `${dataURL}.skel`
    }
  })

  if (
    !fetchedFiles.atlasUrl ||
    !fetchedFiles.imageUrl ||
    !fetchedFiles.skelUrl
  ) {
    throw new Error('Failed to fetch files')
  }

  return fetchedFiles
}

export const fetchFiles = async (files: {
  atlas: string
  png: string
  skel: string
}) => {
  const filePromises: Promise<AxiosResponse<string, ArrayBuffer>>[] = [
    axios.get(REPO_URL + files.atlas, {
      responseType: 'text',
    }),
    axios.get(REPO_URL + files.png, {
      responseType: 'arraybuffer',
    }),
    axios.get(REPO_URL + files.skel, {
      responseType: 'arraybuffer',
    }),
  ]

  const fetchedFiles: {
    atlasUrl: string
    imageUrl: string
    skelUrl: Uint8Array
  } = { atlasUrl: '', imageUrl: '', skelUrl: {} as Uint8Array }

  const responses = await Promise.all(filePromises)

  responses.forEach((response, index) => {
    const mimeType = response.headers['content-type']
    const buffer = Buffer.from(response.data, 'binary')
    const dataURL = `data:${mimeType};base64,${buffer.toString('base64')}`

    if (index === 0) {
      fetchedFiles.atlasUrl = response.data
    } else if (index === 1) {
      fetchedFiles.imageUrl = dataURL
    } else if (index === 2) {
      fetchedFiles.skelUrl = buffer
    }
  })

  if (
    !fetchedFiles.atlasUrl ||
    !fetchedFiles.imageUrl ||
    !fetchedFiles.skelUrl
  ) {
    throw new Error('Failed to fetch files')
  }

  return fetchedFiles
}
