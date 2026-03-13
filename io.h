#pragma once
static inline unsigned char inb(unsigned short port) {
    unsigned char v; asm volatile("inb %1,%0":"=a"(v):"Nd"(port)); return v;
}
static inline void outb(unsigned short port, unsigned char v) {
    asm volatile("outb %0,%1"::"a"(v),"Nd"(port));
}
