// TSU.c - Topology Stepping Universe
// The step is the machine. The machine keeps itself.

#include "TSU.h"
typedef struct term {
  void(*delta)(struct term*t);
} term;
typedef struct state {
  void(*delta )(struct state*s);
  operations *o;

  int i;
  void(*β)(struct state*s, int, int);
  void(*δ)(struct state*s);
  void(*τ)(struct state*s, term*, int);
  void(*instructions[0x1000])(struct state*s);
} state;
long show() {
  return (long)show;
}
void delta(state*s) {
  s->i++;
  asm volatile ("hlt");
  if(s->i % 10 == 0)
    s ->
      o ->
      log("%d\n", s->i);

  s->delta(s);
}
void in0(struct state*s) { s ->   β(s, 3, 1); }
void in1(struct state*s) { s -> τ(s, 0, 1); }
void in2(struct state*s) { s ->      δ(s); }
void in3(struct state*s) { s ->   β(s,-1, 1); }
void in4(struct state*s) { s ->   β(s,-4, 1); }
void in5(struct state*s) { s -> τ(s, 0,-3); }

void β(struct state*s, int a, int b) { }

void τ(struct state*s, term*t, int b) { }

state it = {
  .delta        = delta,
  .β       = β,
  .τ     = τ,
  .instructions = { in0, in1, in2, in3, in4, in5, }
};
void topology_stepping_universe(operations*o) {
  it.o = o;
  it.delta(&it);
}
typedef struct γ γ;
struct γ {
  void(*β)(γ*, void(*)(γ*), void(*)(γ*));
  void(*τ)(γ*, int,         void(*)(γ*));
  void(*δ)(γ*);
};
#define Γ(name) void name(γ*s)
#define Δ(next, op, unit, name) void name(γ*s) { s->op(s, unit, next);}

//void   S(γ*s);
void dot(γ*s) { s->δ(s); }
//void  Sb(γ*s) { s->τ(s, 'b', dot);}
//void  SS(γ*s) { s->β(s, S,   Sb); }
//void  S2(γ*s) { s->β(s, dot, SS); }
//void  Sa(γ*s) { s->τ(s, 'a', dot);}
//void   S(γ*s) { s->β(s, S2,  Sa); }

//D(S, τ, 'b',          A )D(A,
//     β,  S,  τ, 'a', dot)
/*
Here is a formal definition of the space time grammar,
that unifies syntax and semantics and can be captured using a
single dot that points to recursive expression,

G::= dot | terminal(x, G) | branch(G, G),

which treats all derivations uniformly as comutable graph.

Concrete expressions like:

// S → b|Sa
S = branch(
      terminal('b', dot),
      branch(
        branch(S, terminal('a', dot)),
        dot))

// Tab → t|a|b
Tab = terminal('t', terminal('a', terminal('b', dot)))

// Tritab → Tab|Tab|Tab
Tritab = branch(
            branch(Tab, branch(Tab, branch(Tab, dot))),
            dot)

define the structure, while attaching meaning at traversal time
via 𝕊pace and 𝕋ime dimensions ensures semantic orientation.

Traversal traces can be graphed to the same  recursive structure,
making the graph itself a universal language.





Universal  Language     Space     Time
Branch        *          *:𝕊       *:𝕋
             / \        / \       / \
            G   G      𝕋   𝕊     𝕊   𝕋
Terminal      x          x:𝕊       x:𝕋
             / \        / \       / \
            G  'x'     𝕊  'x'    𝕋  'x'
Dot           .          .:𝕊       .:𝕋


    *   = S =  𝕊                          𝕊 = Tritab = *
   / \        / \                        / \          / \
  x   \      𝕋   \                      𝕋   𝕊.       *   .
 / \   *    / \   𝕊                    / \          / \
.   b / \  𝕋.  b / \        x = Tab = 𝕊   \       Tab  *
     *   .      𝕋   𝕊.     / \       / \   𝕋          / \
    / \        / \        x   t     𝕊   t / \       Tab  *
   S   x      S   𝕋      / \       / \   𝕊   \          / \
      / \        / \    x   a     𝕊   a / \   𝕋       Tab  .
     .   a      𝕋.  a  / \       / \   𝕊   t / \
                      .   b     𝕊.  b / \   𝕊   𝕋.
                                     𝕊   a / \ 
                                    / \   𝕊   t
                                   𝕊.  b / \ 
                                        𝕊   a
                                       / \ 
                                      𝕊.  b
*/
