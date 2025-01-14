import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { readbackNeutral, Value } from "../value"

export function readbackByValue(ctx: Ctx, type: Value, value: Value): Core {
  switch (value.kind) {
    case "TypedNeutral": {
      /**
         The `type` in `TypedNeutral` are not used.
      **/

      return readbackNeutral(ctx, value.neutral)
    }

    case "Quote": {
      return Cores.Quote(value.literal)
    }

    default: {
      throw new ElaborationError(
        `readback is not implemented for type: ${type.kind}, and value: ${value.kind}`,
      )
    }
  }
}
