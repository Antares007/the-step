#include "io.h"
/* The I/O ports */
#define FB_COMMAND_PORT 0x3D4
#define FB_DATA_PORT 0x3D5

/* The I/O port commands */
#define FB_HIGH_BYTE_COMMAND 14
#define FB_LOW_BYTE_COMMAND 15
/** fb_move_cursor:
 *  Moves the cursor of the framebuffer to the given position
 *
 *  @param pos The new position of the cursor
 */
void fb_move_cursor(unsigned short pos) {
  outb(FB_COMMAND_PORT, FB_HIGH_BYTE_COMMAND);
  outb(FB_DATA_PORT, ((pos >> 8) & 0x00FF));
  outb(FB_COMMAND_PORT, FB_LOW_BYTE_COMMAND);
  outb(FB_DATA_PORT, pos & 0x00FF);
}

/** fb_write_cell:
 *  Writes a character with the given foreground and background to position i
 *  in the framebuffer.
 *
 *  @param i  The location in the framebuffer
 *  @param c  The character
 *  @param fg The foreground color
 *  @param bg The background color
 */
void fb_write_cell(unsigned int i, char c, unsigned char fg, unsigned char bg) {
  char *fb = (char *)0x000B8000;
  fb[i] = c;
  fb[i + 1] = ((fg & 0x0F) << 4) | (bg & 0x0F);
  fb_move_cursor(i / 2);
}
#include "serial.h"
#include "stdarg.h"
int ksnprintf(char *buf, unsigned int size, const char *fmt, ...);
int kvsnprintf(char *buf, unsigned int size, const char *fmt, va_list ap);
void myosin_log(const char *fmt, ...) {
  static char buf[2048];
  va_list ap;
  va_start(ap, fmt);
  kvsnprintf(buf, sizeof(buf) / sizeof(*buf), fmt, ap);
  va_end(ap);
  serial_write(SERIAL_COM1, buf);
}
extern char myosin_free;
static void pic_remap(void) {
    outb(0x20, 0x11); outb(0xA0, 0x11);  // ICW1
    outb(0x21, 0x20); outb(0xA1, 0x28);  // ICW2: remap master→32, slave→40
    outb(0x21, 0x04); outb(0xA1, 0x02);  // ICW3: cascade
    outb(0x21, 0x01); outb(0xA1, 0x01);  // ICW4: 8086 mode
    outb(0x21, 0xFC); outb(0xA1, 0xFF);  // mask all except IRQ0+IRQ1
}
void myosin() {
  serial_init(SERIAL_COM1);
  fb_write_cell(0, 'm', 15, 0);
  fb_write_cell(2, 'y', 15, 0);
  fb_write_cell(4, 'o', 15, 0);
  fb_write_cell(6, 's', 15, 0);
  fb_write_cell(8, 'i', 15, 0);
  fb_write_cell(10, 'n', 15, 0);
  fb_write_cell(160 * 12 + 80, 'x', 4, 15);

  pic_remap();
  asm volatile("sti");
  myosin_log("here comes div/0\n");
  volatile int q = 0;
  int r = 1 / q;
  r = 2 / q;
  myosin_log("r = %d\n", r);
  r = 3 / q;
  myosin_log("r = %d\n", r);
  r = 4 / q;
  myosin_log("r = %d\n", r);
}

