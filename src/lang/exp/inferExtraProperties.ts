import { Core, evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer } from "../exp"
import * as Values from "../value"

export function inferExtraProperties(
  ctx: Ctx,
  properties: Record<string, Exp>,
  names: Array<string>,
): { clazz: Values.Clazz; properties: Record<string, Core> } {
  const extraInferred = Object.entries(properties)
    .filter(([name, exp]) => !names.includes(name))
    .map(([name, exp]): [string, Exps.Inferred] => [name, infer(ctx, exp)])
  const extraProperties = Object.fromEntries(
    extraInferred.map(([name, inferred]) => [name, inferred.core]),
  )

  const extraTypedValues = Object.fromEntries(
    extraInferred.map(([name, inferred]) => [
      name,
      {
        type: inferred.type,
        value: evaluate(ctxToEnv(ctx), inferred.core),
      },
    ]),
  )

  return {
    clazz: Values.clazzFromTypedValues(extraTypedValues),
    properties: extraProperties,
  }
}
