import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse ImplicitAp", () => {
  expect(parseExp("f(implicit x)")).toMatchObject(
    deleteUndefined(
      Exps.FoldedAp(Exps.Var("f"), [Exps.ArgImplicit(Exps.Var("x"))]),
    ),
  )

  expect(parseExp("f(implicit x, y)")).toMatchObject(
    deleteUndefined(
      Exps.FoldedAp(Exps.Var("f"), [
        Exps.ArgImplicit(Exps.Var("x")),
        Exps.ArgPlain(Exps.Var("y")),
      ]),
    ),
  )
})
