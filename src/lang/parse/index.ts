import pt from "@cicada-lang/partech"
import * as grammars from "./grammars"
import * as matchers from "./matchers"

export const parseExp = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "exp"),
  matcher: matchers.exp_matcher,
})