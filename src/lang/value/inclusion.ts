import { applyClosure } from "../closure"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { conversion, inclusionClazz, Value } from "../value"

/**

   # Subtyping

   We use the word `inclusion` to name our function
   which implements the subtyping relation.

   Comparing it with the word `conversion`
   for equivalent relation between types.

   `inclusion` is like `conversion` but applies only to types,
   and also handles subtyping between classes,
   -- simple attribute based subtype relation.

   `conversion` is implemented by `readback` and `alphaEquivalent`,

   We will not implement `Union` and `Intersection` types.

   We only use tagged union (sum type in ADT),
   -- which will be implemented by our induction datatypes.

**/

export function inclusion(ctx: Ctx, subtype: Value, type: Value): void {
  if (subtype.kind === "Pi" && type.kind === "Pi") {
    /**
       Contravariant in argument position.

       The order of type and subtype is swapped
       in the following recursive call to `inclusion`.
    **/

    inclusion(ctx, type.argType, subtype.argType)
    const name = subtype.retTypeClosure.name
    const argType = subtype.argType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(argType, variable)

    ctx = CtxCons(freshName, argType, ctx)

    inclusion(
      ctx,
      applyClosure(subtype.retTypeClosure, typedNeutral),
      applyClosure(type.retTypeClosure, typedNeutral),
    )

    return
  }

  if (subtype.kind === "Sigma" && type.kind === "Sigma") {
    inclusion(ctx, subtype.carType, type.carType)
    const name = subtype.cdrTypeClosure.name
    const carType = subtype.carType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(carType, variable)

    ctx = CtxCons(freshName, carType, ctx)

    inclusion(
      ctx,
      applyClosure(subtype.cdrTypeClosure, typedNeutral),
      applyClosure(type.cdrTypeClosure, typedNeutral),
    )

    return
  }

  if (Values.isClazz(subtype) && Values.isClazz(type)) {
    inclusionClazz(ctx, subtype, type)
    return
  }

  conversion(ctx, Values.Type(), subtype, type)
}
