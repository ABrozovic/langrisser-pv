import { convertSkelToSpine } from '@/lib/convert-spine'
import { fetchDB, fetchFiles } from '@/lib/fetcher'
import { Spine } from 'pixi-spine'
import { create, UseBoundStore, StoreApi } from 'zustand'

export type CharacterFile = {
  atlas: string
  png: string
  skel: string
}

export type Character = {
  complete: boolean
  files: CharacterFile
}

export type DB = {
  char: Record<string, Record<string, Character>>
  char01: unknown
}

type SpineState = {
  db: DB | undefined
  activeCharacter: string
  characterList: string[]
  skinList: string[]
  spineAnimation: Spine | undefined

  setCharacter: (index: number) => Promise<void>
  setSkin: (index: number) => Promise<void>
  init: () => Promise<void>

  error?: string
}

export const useSpineStore: UseBoundStore<StoreApi<SpineState>> =
  create<SpineState>((set, get) => ({
    db: undefined,
    activeCharacter: '',
    characterList: [],
    skinList: [],
    spineAnimation: undefined,

    setCharacter: async (index: number) => {
      const db = get().db

      if (!db) return

      const selectedCharacter = get().characterList[index]

      const skins = Object.keys(db.char[selectedCharacter])
      const availableSkins = skins?.filter(
        (skin) => db.char[selectedCharacter][skin].complete,
      )

      if (!availableSkins || availableSkins.length === 0) return

      try {
        const characterFiles =
          db.char[selectedCharacter][availableSkins[0]].files

        const fileUrls = await fetchFiles(characterFiles)

        const spine = convertSkelToSpine(
          fileUrls.atlasUrl,
          fileUrls.imageUrl,
          fileUrls.skelUrl,
        )
        set({
          spineAnimation: spine,
          error: '',
          skinList: availableSkins,
          activeCharacter: selectedCharacter,
        })
      } catch (error) {
        console.log(error)
        set({
          error: 'Failed to load character or default skin.',
          skinList: availableSkins,
          activeCharacter: selectedCharacter,
        })
      }
    },

    setSkin: async (index: number) => {
      const db = get().db

      if (!db) return

      const skins = get().skinList
      const character = get().activeCharacter
      const selectedSkin = skins[index]
      const characterFiles = db.char[character][selectedSkin].files

      try {
        const fileUrls = await fetchFiles(characterFiles)

        const spine = convertSkelToSpine(
          fileUrls.atlasUrl,
          fileUrls.imageUrl,
          fileUrls.skelUrl,
        )

        set({ spineAnimation: spine, error: '' })
      } catch (error) {
        console.log(error)
        set({ error: 'Failed to load skin.' })
      }
    },

    init: async () => {
      const db = await fetchDB()
      const characterList = Object.keys(db.char)
      return set({ db, characterList })
    },
  }))
