#pragma once

typedef struct operations {
  void(*log)(const char*, ...);
} operations;

void topology_stepping_universe(operations*o);
