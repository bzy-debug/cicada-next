import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ImplicitPi", async () => {
  const output = await runCode(`

compute (implicit T: Type, x: T) -> Type

`)

  expect(output).toMatchInlineSnapshot(
    '"(implicit T: Type, x: T) -> Type: Type"',
  )
})
