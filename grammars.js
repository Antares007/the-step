export function T(o) {
  o(S)
  o(A)
  o(expression)
  o(S, A, expression)
}
export function expression(o) {
  o(additive)
  function additive(o) {
    o(multiplicative)
    o(additive, "+", multiplicative)
    o(additive, "-", multiplicative)
  }
  function multiplicative(o) {
    o(unary)
    o(multiplicative, "*", unary)
    o(multiplicative, "/", unary)
  }

  function unary(o) {
    o(primary)
    o("-", unary)
    o("!", unary)
  }

  function primary(o) {
    o(constant)
    o("(", expression, ")")
  }

  function constant(o) {
    ;(o("1"), o("2"), o("3"))
  }
}
export function declarations(o) {
  o(declaration)
  o(declarations, sp, declaration)
  function declaration(o) {
    o(name, sp, productions, sp, ".")
    function name(o) {
      o(alfa)
      o(name, alfa)
    }
    function alfa(o) {
        o("a"),
        o("b"),
        o("0")
    }
    function productions(o) {
      o(production)
      o(productions, sp, ",", sp, production)
      function production(o) {
        o(primary, quantifier)
        o(production, sp, primary, quantifier)
        function primary(o) {
          o(name)
          o('"', alfa, '"')
          o("(", sp, productions, sp, ")")
        }
        function quantifier(o) {
          ;(o("?"), o("+"), o("*"))
        }
      }
    }
  }
  function sp(o) {
    o(sp)
    o(sp, space_char)
    function space_char(o) {
      ;(o(" "), o("\t"), o("\n"))
    }
  }
}
