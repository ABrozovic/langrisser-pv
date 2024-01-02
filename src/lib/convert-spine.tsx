import { Spine, TextureAtlas } from 'pixi-spine'
import { Spine as Spine34 } from '@pixi-spine/runtime-3.4'
import { Spine as Spine38 } from '@pixi-spine/runtime-3.8'
import { BaseTexture } from 'pixi.js'

import { SkelToJson } from '@/lib/spine-converter/spine-skel-to-json'
import { SpineLoader } from '@/lib/spine-loader/spine-loader'

export const convertSkelToSpine = (
  atlasText: string,
  imageUrl: string,
  skelFile: unknown,
) => {
  const texturedAtlas = new TextureAtlas(atlasText, (_, callback) =>
    callback(BaseTexture.from(imageUrl)),
  )

  const spineLoader = new SpineLoader()
  const binaryParser = spineLoader.createBinaryParser()
  const skeletonToConvert = spineLoader.parseData(
    binaryParser,
    texturedAtlas,
    skelFile,
  )
  console.log(skeletonToConvert.spineData)
  // @ts-expect-error "spineData"
  const spineToConvert = new Spine34(skeletonToConvert.spineData)
  // @ts-expect-error "spineData"
  const jsonToConvert = new SkelToJson(spineToConvert)

  const spineString = jsonToConvert.toJSON()

  const convertedJson = JSON.parse(spineString)

  const jsonParser = spineLoader.createJsonParser()
  const skeleton = spineLoader.parseData(
    jsonParser,
    texturedAtlas,
    convertedJson,
  )
  // @ts-expect-error "spineData"
  const spine = new Spine38(skeleton.spineData)

  return spine as unknown as Spine
}
