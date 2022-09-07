import { applyClosure } from "../closure"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, readback } from "../value"

export function checkNewArgs(
  ctx: Ctx,
  args: Array<Exps.Arg>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      if (args.length !== 0) {
        throw new ElaborationError(
          `checkNewArgs too many arguments when calling new`,
        )
      }

      return {}
    }

    case "ClazzCons": {
      if (args.length === 0) {
        throw new ElaborationError(
          `checkNewArgs not enough arguments when calling new, require property: ${clazz.name}`,
        )
      }

      const [arg, ...restArgs] = args
      const propertyCore = check(ctx, arg.exp, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)
      ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
      return {
        [clazz.name]: propertyCore,
        ...checkNewArgs(ctx, restArgs, rest),
      }
    }

    case "ClazzFulfilled": {
      const propertyCore = readback(ctx, clazz.propertyType, clazz.property)

      return {
        [clazz.name]: propertyCore,
        ...checkNewArgs(ctx, args, clazz.rest),
      }
    }
  }
}