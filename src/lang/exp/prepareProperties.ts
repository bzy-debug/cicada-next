import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp, infer } from "../exp"
import * as Values from "../value"

export function prepareProperties(
  ctx: Ctx,
  properties: Array<Exps.Property>,
): Record<string, Exp> {
  const found: Set<string> = new Set()
  const record: Record<string, Exp> = {}

  for (const property of properties) {
    for (const [name, exp] of prepareProperty(ctx, property)) {
      if (found.has(name)) {
        throw new ElaborationError(`duplicate properties: ${name}`)
      }

      record[name] = exp
      found.add(name)
    }
  }

  return record
}

export function prepareProperty(
  ctx: Ctx,
  property: Exps.Property,
): Array<[string, Exp]> {
  switch (property.kind) {
    case "PropertyPlain": {
      return [[property.name, property.exp]]
    }

    case "PropertySpread": {
      /**
         Type directed spread
      **/
      const inferred = infer(ctx, property.exp)
      Values.assertClazzInCtx(ctx, inferred.type)
      const names = Values.clazzPropertyNames(inferred.type)
      return names.map((name) => [name, Exps.Dot(property.exp, name)])
    }
  }
}
