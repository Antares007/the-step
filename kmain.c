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
extern char text_start;
extern char text_end;
extern char rodata_start;
extern char rodata_end;
extern char data_start;
extern char data_end;
extern char bss_start;
extern char bss_end;
extern char kernel_end;
char a[2048];
int sum_of_three(int arg1, int arg2, int arg3) {
  serial_init(SERIAL_COM1);
  fb_write_cell(0, 'a', 15, 0);
  fb_write_cell(2, 'c', 15, 0);
  fb_write_cell(4, 'h', 15, 0);
  fb_write_cell(6, 'o', 15, 0);
  fb_write_cell(160 * 12 + 80, 'x', 4, 15);

//  myosin_log("%d, %d, %d\n", 1, 2, 3);

#define MAP(n, s, e) \
    myosin_log("[%x-%x] "#n" %db\n", &s, &e, &e - &s);
  MAP(text, text_start, text_end)
  MAP(rodata, rodata_start, rodata_end)
  MAP(data, data_start, data_end)
  MAP(bss, bss_start, bss_end)
  MAP(kernel, text_start, kernel_end)
#undef MAP

  return arg1 + arg2 + arg3;
}
