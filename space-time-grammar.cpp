#include <iostream>
#include <unordered_map>
#include <type_traits>

auto dot = [](auto o){ o(); };

auto S = [](auto o) {
  auto S = [ ](auto o,
               auto S) { o(
           [&](auto o) { o(dot,
           [&](auto o) { o(S, [](auto o) { o('a', dot); }); }); },
           [ ](auto o) { o('b', dot); }); };
  S(o, S);
};

auto tab = [](auto o) { o('t',
           [](auto o) { o('a',
           [](auto o) { o('b', dot); }); }); };

auto tritab = [](auto o) { o(
              [](auto o) { o(
              [](auto o) { o(dot,
              [](auto o) { o(tab,
              [](auto o) { o('0',
              [](auto o) { o('1', dot); }); }); }); },
              [](auto o) { o(tab,
              [](auto o) { o('1',
              [](auto o) { o('2', dot); }); }); }); },
              [](auto o) { o(tab,
              [](auto o) { o('3',
              [](auto o) { o('5', dot); }); }); }); };

// ── sym_key: one stable void* per lambda TYPE ─────────────────────────────────
// A static local inside a function template has exactly one address per
// template instantiation — i.e., one address per distinct lambda type.
// All copies/instances of the same captureless lambda share the same type,
// so they hash to the same key regardless of where they were constructed.
// This mirrors JS where every reference to the same named function is identical.
template<class F>
void* sym_key()            { static char x; return &x; }
template<class F>
void* sym_key(const F&)    { return sym_key<F>(); }

// ── callable1: detects whether F(A) compiles ─────────────────────────────────
// Used to distinguish proper 1-arg symbols from the 2-arg inner recursive S.
// Time::operator()(s,t) only calls bnf_impl(s) when s is a 1-arg symbol.
template<class F, class A, class = void>
struct callable1 : std::false_type {};
template<class F, class A>
struct callable1<F,A,std::void_t<decltype(std::declval<F>()(std::declval<A>()))>>
  : std::true_type {};

// ── Forward declarations ───────────────────────────────────────────────────────
template<class Symbol> struct Space;
template<class Symbol>
void bnf_impl(const Symbol&, std::unordered_map<void*,int>&);

// ── Time: the "inner" observer — sequences symbols within one production ──────
// time[0]()     → ".\n"          (end of sequence)
// time[1](s, t) → " <addr>", t(time), bnf(s)   (non-terminal reference)
// time[2](x, t) → " x",      t(time)            (terminal character)
template<class Rule>
struct Time {
  const Rule& rule;
  std::unordered_map<void*,int>& d;

  void operator()() const {                           // [0] end
    std::cout << ".\n";
  }
  void operator()(auto s, auto t) const {             // [1] non-terminal in sequence
    std::cout << " " << sym_key(s);
    t(*this);
    // Skip bnf_impl for the 2-arg inner recursive lambda (would fail to compile
    // with 1 arg, and the memo would stop it at runtime anyway).
    if constexpr (callable1<decltype(s), Space<Rule>>::value)
      bnf_impl(s, d);
  }
  void operator()(char x, auto t) const {             // [2] terminal in sequence
    std::cout << " " << x;
    t(*this);
  }
};

// ── Space: the "outer" observer — enumerates alternatives of rule S ───────────────
// Exactly the draft struct Space, with operator()(auto s, auto t) filled in.
//
// space[0]()     → "\n"                             (end of alternatives)
// space[1](s, t) → "<S> →", t(time), s(space)       (sym-headed alternative)
// space[2](x, s) → "<S> → x.\n", s(space)           (char-headed alternative)
template<class Symbol>
struct Space {
  Symbol& S;
  std::unordered_map<void*,int>& d;

  void operator()() const {                           // [0]
    std::cout << "\n";
  }
  void operator()(auto s, auto t) const {             // [1]
    std::cout << sym_key(S) << " →";
    t(Time<Symbol>{S, d});   // t walks the sequence in time context
    s(*this);                // s walks remaining alternatives in space context
  }
  void operator()(char x, auto s) const {             // [2]
    std::cout << sym_key(S) << " → " << x << ".\n";
    s(*this);
  }
};

// ── bnf_impl ──────────────────────────────────────────────────────────────────
template<class Symbol>
void bnf_impl(const Symbol& S, std::unordered_map<void*,int>& d) {
  void* key = sym_key(S);
  if (d.count(key)) { std::cout << "\n"; return; }   // memo: already expanded
  d[key] = 1;
  S(Space<Symbol>{const_cast<Symbol&>(S), d});
}

// ── bnf: entry point (mirrors the draft exactly) ─────────────────────────────
auto bnf = [](auto S) {
  std::unordered_map<void*,int> d;
  bnf_impl(S, d);
};

int main() {
  bnf(tritab);
  bnf(S);
}
