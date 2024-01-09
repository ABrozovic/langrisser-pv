'use client'

import useSpine from '@/hooks/use-pixi-spine'
import '@/globals.css'
import { Label } from './ui/label'
import ComboBox from './ui/combobox'
import { useSpineStore } from './store/spine'
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { SpineControlButtons } from './spine-control'

export default function APP() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Langrisser />
    </ThemeProvider>
  )
}

export function Langrisser() {
  const pixiSpine = useSpine()
  const characterList = useSpineStore((state) => state.characterList)
  const setCharacter = useSpineStore((state) => state.setCharacter)

  const skinList = useSpineStore((state) => state.skinList)
  const setSkin = useSpineStore((state) => state.setSkin)

  const init = useSpineStore((state) => state.init)

  const spine = useSpineStore((state) => state.spineAnimation)

  const activeCharacter = useSpineStore((state) => state.activeCharacter)
  const activeSkin = useSpineStore((state) => state.activeSkin)

  const error = useSpineStore((state) => state.error)

  React.useEffect(() => {
    init()
  }, [init])

  React.useEffect(() => {
    if (!spine) return
    pixiSpine.init(spine)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spine])

  return (
    <div className="container relative flex min-h-screen w-full flex-col items-center gap-6 py-6">
      <div className="flex w-full flex-col gap-4 md:px-6 ">
        <div className="flex w-full flex-col gap-2 md:flex-row">
          <div className="w-full">
            <Label>Character list:</Label>
            <ComboBox
              disabled={(characterList ?? []).length <= 0}
              disabledText="Loading db..."
              searchText="Search by character name"
              selectText="Select a character"
              notFoundText="No characters found"
              data={characterList.map((character, i) => ({
                label: character,
                value: i.toString(),
              }))}
              onChange={async (value) => {
                await setCharacter(parseInt(value))
              }}
            />
          </div>
          <div className="w-full">
            <Label>Skin list:</Label>
            <ComboBox
              key={activeCharacter}
              disabled={(skinList ?? []).length <= 0}
              defaultValue={{ value: '0', label: skinList[0] }}
              disabledText="Load a character first"
              searchText="Search by skin name"
              selectText="Select a skin"
              notFoundText="No skins found"
              data={skinList.map((skin, i) => ({
                value: i.toString(),
                label: skin,
              }))}
              onChange={(value) => {
                setSkin(parseInt(value))
              }}
            />
          </div>
          <div className="w-full">
            <Label>Animation list:</Label>
            <ComboBox
              key={activeSkin}
              defaultValue={{
                value: '0',
                label: 'idle_Normal',
              }}
              disabled={(pixiSpine.animationList ?? []).length <= 0}
              disabledText="Load a skin first"
              searchText="Search by skin name"
              selectText="Select a skin"
              notFoundText="No skins found"
              data={pixiSpine.animationList?.map((animation, i) => ({
                value: i.toString(),
                label: animation,
              }))}
              onChange={(value) => pixiSpine.playAnimation(parseInt(value))}
            />
          </div>
        </div>
        {error && <Label className="text-red-500">{error}</Label>}
        <SpineControlButtons pixiData={pixiSpine}></SpineControlButtons>
      </div>

      <div className=" h-full w-full flex-1">{pixiSpine.render}</div>
    </div>
  )
}
