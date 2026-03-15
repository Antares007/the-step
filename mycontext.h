#pragma once

typedef struct Ψ Ψ;
struct Ψ {
  Ψ*Red;
  Ψ*Yellow;
  Ψ*Green;
  Ψ*Blue;
  union {
    int ui;
    int i;
    void*v;
    unsigned char uc;
    char c;
    void(*step)();
  } gate[];
};

