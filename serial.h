#pragma once

#define SERIAL_COM1 0x3F8

void serial_init(unsigned short port);
void serial_putchar(unsigned short port, char c);
void serial_write(unsigned short port, const char *str);
