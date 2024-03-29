import type { IIkConstraintData } from '@pixi-spine/base'

import type { BoneData } from './BoneData'
import { ConstraintData } from './Constraint'

/**
 * @public
 */
export class IkConstraintData
  extends ConstraintData
  implements IIkConstraintData
{
  bones = new Array<BoneData>()
  target: BoneData
  bendDirection = 1
  compress = false
  stretch = false
  uniform = false
  mix = 1
  softness = 0

  constructor(name: string) {
    super(name, 0, false)
  }
}
