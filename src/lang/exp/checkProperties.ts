import { applyClosure } from "../closure"
import { Core, evaluate } from "../core"
import { Ctx, CtxFulfilled, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import { check, Exp } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, conversion } from "../value"

export function checkProperties(
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const property = properties[clazz.name]
      if (property === undefined) {
        // TODO improve error report
        throw new ElaborationError(`missing property: ${clazz.name}`)
      }

      const propertyCore = check(ctx, property, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(clazz.name, clazz.propertyType, propertyValue, ctx)
      const rest = applyClosure(clazz.restClosure, propertyValue)
      assertClazzInCtx(ctx, rest)
      return {
        [clazz.name]: propertyCore,
        ...checkProperties(ctx, properties, rest),
      }
    }

    case "ClazzFulfilled": {
      const property = properties[clazz.name]
      if (property === undefined) {
        // TODO improve error report
        throw new ElaborationError(`missing property: ${clazz.name}`)
      }

      const propertyCore = check(ctx, property, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      conversion(ctx, clazz.propertyType, propertyValue, clazz.property)
      ctx = CtxFulfilled(clazz.name, clazz.propertyType, propertyValue, ctx)
      return {
        [clazz.name]: propertyCore,
        ...checkProperties(ctx, properties, clazz.rest),
      }
    }
  }
}
