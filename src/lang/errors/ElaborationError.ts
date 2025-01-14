import { LangError } from "./LangError"

export class ElaborationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
