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
void myosin() {
  serial_init(SERIAL_COM1);
  fb_write_cell(0, 'm', 15, 0);
  fb_write_cell(2, 'y', 15, 0);
  fb_write_cell(4, 'o', 15, 0);
  fb_write_cell(6, 's', 15, 0);
  fb_write_cell(8, 'i', 15, 0);
  fb_write_cell(10, 'n', 15, 0);
  fb_write_cell(160 * 12 + 80, 'x', 4, 15);
}

