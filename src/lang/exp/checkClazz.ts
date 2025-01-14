import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, CtxCons, CtxFulfilled, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { check, checkType } from "../exp"

export function checkClazz(ctx: Ctx, exp: Exps.Clazz): Cores.Clazz {
  switch (exp.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      const propertyTypeCore = checkType(ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      ctx = CtxCons(exp.name, propertyTypeValue, ctx)
      const restCore = checkClazz(ctx, exp.rest)
      return Cores.ClazzCons(exp.name, exp.name, propertyTypeCore, restCore)
    }

    case "ClazzFulfilled": {
      const propertyTypeCore = checkType(ctx, exp.propertyType)
      const propertyTypeValue = evaluate(ctxToEnv(ctx), propertyTypeCore)
      const propertyCore = check(ctx, exp.property, propertyTypeValue)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxFulfilled(exp.name, propertyTypeValue, propertyValue, ctx)
      const restCore = checkClazz(ctx, exp.rest)
      return Cores.ClazzFulfilled(
        exp.name,
        propertyTypeCore,
        propertyCore,
        restCore,
      )
    }
  }
}
