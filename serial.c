#include "serial.h"
#include "io.h"

/* COM port register offsets */
#define SERIAL_DATA 0    /* Data register (DLAB=0) */
#define SERIAL_IER 1     /* Interrupt Enable (DLAB=0) */
#define SERIAL_BAUD_LO 0 /* Baud rate divisor LSB (DLAB=1) */
#define SERIAL_BAUD_HI 1 /* Baud rate divisor MSB (DLAB=1) */
#define SERIAL_FCR 2     /* FIFO Control Register */
#define SERIAL_LCR 3     /* Line Control Register */
#define SERIAL_MCR 4     /* Modem Control Register */
#define SERIAL_LSR 5     /* Line Status Register */

#define SERIAL_LCR_DLAB 0x80 /* Divisor Latch Access Bit */
#define SERIAL_LCR_8N1 0x03  /* 8 bits, no parity, 1 stop bit */
#define SERIAL_LSR_THRE 0x20 /* Transmit Holding Register Empty */

void serial_init(unsigned short port) {
  outb(port + SERIAL_IER, 0x00); /* disable all interrupts */

  outb(port + SERIAL_LCR, SERIAL_LCR_DLAB); /* enable DLAB */
  outb(port + SERIAL_BAUD_LO, 0x03);        /* 38400 baud (divisor=3) */
  outb(port + SERIAL_BAUD_HI, 0x00);

  outb(port + SERIAL_LCR, SERIAL_LCR_8N1); /* 8N1, clear DLAB */
  outb(port + SERIAL_FCR, 0xC7); /* enable+clear FIFO, 14-byte threshold */
  outb(port + SERIAL_MCR, 0x03); /* DTR + RTS */
}

static void serial_wait_ready(unsigned short port) {
  while ((inb(port + SERIAL_LSR) & SERIAL_LSR_THRE) == 0)
    ;
}

void serial_putchar(unsigned short port, char c) {
  serial_wait_ready(port);
  outb(port + SERIAL_DATA, (unsigned char)c);
}

void serial_write(unsigned short port, const char *str) {
  while (*str) {
    if (*str == '\n')
      serial_putchar(port, '\r'); /* CRLF for terminals */
    serial_putchar(port, *str++);
  }
}
