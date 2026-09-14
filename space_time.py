def dot(D, B, T):
    D()
def tab2(D, B, T):
    B('b', dot)
def tab1(D, B, T):
    B('a', tab2)
def tab(D, B, T):
    B('t', tab1)

# tritab ::= tab tab tab
def tritab3(D, B, T):
    T(tab, dot)
def tritab2(D, B, T):
    T(tab, tritab3)
def tritab1(D, B, T):
    T(tab, tritab2)
def tritab(D, B, T):
    T(dot, tritab1)

def space(S, str_, c):
    def D():
        pass
    def B(x, s):
        if str_.startswith(x):
            c(str_[len(x):])
        space(s, str_, c)
    def T(s, t):
        time(t, str_, c)
        space(s, str_, c)
    S(D, B, T)

def time(S, str_, c):
    def D():
        c(str_)
    def B(x, t):
        if str_.startswith(x):
            time(t, str_[len(x):], c)
    def T(s, t):
        space(s, str_, lambda str_: time(t, str_, c))
    S(D, B, T)

space(tritab, "tab?", print)
