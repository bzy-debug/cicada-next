import { AlphaCtx, alphaEquivalent, Core } from "../core"
import { ElaborationError } from "../errors"

export function alphaEquivalentProperties(
  ctx: AlphaCtx,
  leftProperties: Record<string, Core>,
  rightProperties: Record<string, Core>,
): void {
  const leftSize = Object.keys(leftProperties).length
  const rightSize = Object.keys(rightProperties).length

  if (leftSize !== rightSize) {
    throw new ElaborationError(
      `alphaEquivalentProperties expect the left size: ${leftSize} to be equal to the right size: ${rightSize}`,
    )
  }

  for (const [name, left] of Object.entries(leftProperties)) {
    const right = rightProperties[name]
    if (right === undefined) {
      throw new ElaborationError(
        `alphaEquivalentProperties missing property: ${name} on the right side`,
      )
    }

    alphaEquivalent(ctx, left, right)
  }
}
