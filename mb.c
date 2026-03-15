#include <stdint.h>
#include <stdarg.h>

#define COM1 0x3F8
static inline unsigned char inb(unsigned short port) {
  unsigned char v; asm volatile("inb %1,%0":"=a"(v):"Nd"(port)); return v;
}
static inline void outb(unsigned short port, unsigned char v) {
  asm volatile("outb %0,%1"::"a"(v),"Nd"(port));
}
static void serial_init(unsigned short port) {
  outb(port + 1, 0x00);   /* disable interrupts */
  outb(port + 3, 0x80);   /* DLAB on */
  outb(port + 0, 0x03);   /* 38400 baud */
  outb(port + 1, 0x00);
  outb(port + 3, 0x03);   /* 8N1, DLAB off */
  outb(port + 2, 0xC7);   /* FIFO on */
  outb(port + 4, 0x03);   /* DTR + RTS */
}
static void serial_putchar(unsigned short port, char c) {
  while (!(inb(port + 5) & 0x20));
  outb(port + 0, c);
}
static void serial_write(unsigned short port, const char *s) {
  while (*s) {
    if (*s == '\n') serial_putchar(port, '\r');
    serial_putchar(port, *s++);
  }
}

static void put(char *b, unsigned int *p, unsigned int n, char c) {
  if (*p < n - 1) b[(*p)++] = c;
}
static void putu(char *b, unsigned int *p, unsigned int n,
    unsigned long v, int base) {
  char tmp[32]; int i = 0;
  if (!v) { put(b, p, n, '0'); return; }
  while (v) { tmp[i++] = "0123456789abcdef"[v % base]; v /= base; }
  while (i--) put(b, p, n, tmp[i]);
}
static int kvsnprintf(char *b, unsigned int n, const char *fmt, va_list ap) {
  if (!b || n == 0) return 0;
  unsigned int p = 0;
  for (; *fmt && p < n - 1; fmt++) {
    if (*fmt != '%') { put(b, &p, n, *fmt); continue; }
    switch (*++fmt) {
      case 's': { const char *s = va_arg(ap, const char *);
                  for (s = s ? s : "(null)"; *s; s++) put(b, &p, n, *s);
                  break; }
      case 'c': put(b, &p, n, va_arg(ap, int)); break;
      case 'd': { long v = va_arg(ap, int);
                  if (v < 0) { put(b, &p, n, '-'); v = -v; }
                  putu(b, &p, n, v, 10); break; }
      case 'u': putu(b, &p, n, va_arg(ap, unsigned), 10); break;
      case 'x': putu(b, &p, n, va_arg(ap, unsigned), 16); break;
      case 'p': put(b, &p, n, '0'); put(b, &p, n, 'x');
                putu(b, &p, n, (unsigned long)va_arg(ap, void *), 16); break;
      case '%': put(b, &p, n, '%'); break;
    }
  }
  b[p] = '\0';
  return p;
}
//static int ksnprintf(char *b, unsigned int n, const char *fmt, ...) {
//  va_list ap; va_start(ap, fmt);
//  int r = kvsnprintf(b, n, fmt, ap);
//  va_end(ap); return r;
//}
static void log_init() { serial_init(COM1); }
static void log(const char *fmt, ...) {
    static char buf[256];
    va_list ap; va_start(ap, fmt);
    kvsnprintf(buf, sizeof(buf), fmt, ap);
    va_end(ap);
    serial_write(COM1, buf);
}

__attribute__((section(".multiboot"), used))
static const uint32_t mboot[3] = { 0x1BADB002, 2, -0x1BADB004 };

typedef struct { uint32_t flags, a,b,c,d,e,f, syms[4], mmap_length, mmap_addr; } __attribute__((packed)) mbi_t;
typedef struct { uint32_t size; uint64_t base, length; uint32_t type; } __attribute__((packed)) mmap_t;

static uint8_t stack[16384] __attribute__((aligned(16)));


static void __attribute__((used)) on_interrupt(unsigned int*ctx) {
  int vector = ctx[0];
  log("%s %d\n", __func__, ctx[0]);
  if(vector == 0) {
    log("0x%x\n", ctx[9]);
    ctx[9] += 2;
  } else  if (32 <= vector && vector <= 47) {
    if (vector == 33) {
      unsigned char sc = inb(0x60);
      log("key: 0x%x\n", sc);
    }
    if (vector >= 40) outb(0xA0, 0x20); // Send EOI to Slave
    outb(0x20, 0x20);                   // Send EOI to Master
  }
}
static void __attribute__((used)) on_error(unsigned int*ctx) {
  log("%s %d\n", __func__, ctx[0]);
}

static void __attribute__((naked, used)) idt_handlers(void) {
  __asm__ volatile (
      ".macro HANDLER num, type\n"
      "   .align 32\n"
      "   pusha\n"
      "   .byte 0x68\n"
      "   .long \\num\n"
      "   push %%esp\n"
      "   push $iret_\\type\n"
      "   jmp on_\\type\n"
      ".endm\n"

      ".set i, 0\n"
      
      ".rept 256\n"
      "    .if i == 8 || (10 <= i && i <= 14) || i == 17\n"
      "        HANDLER i, error\n"
      "    .else\n"
      "        HANDLER i, interrupt\n"
      "    .endif\n"
      "    .set i, i  + 1\n"
      ".endr\n"

      ::: "memory"
      );
}
static void __attribute__((naked, used)) iret_error(void) {
  __asm__ volatile (
      "add $8, %%esp\n"
      "popa\n"
      "add $4, %%esp\n"
      "iret\n"
      ::: "memory"
      );
}
static void __attribute__((naked, used)) iret_interrupt(void) {
  __asm__ volatile (
      "add $8, %%esp\n"
      "popa\n"
      "iret\n"
      ::: "memory"
      );
}
static void load_idt() {
  static unsigned int idt[512] = {0};
  static struct {
    short limit;
    unsigned int base;
  } __attribute__((packed)) idt_ptr = {.limit = 256 * 8 - 1, .base = (unsigned int)idt};

  unsigned short cs;
  asm("mov %%cs, %0" : "=r"(cs));

  for (int n = 0; n < 256; n++) {
    unsigned int handler = (unsigned int)((char*)idt_handlers + (n * 32));
    idt[n * 2 + 0] = (cs << 16) | (handler & 0xFFFF);
    idt[n * 2 + 1] = (handler & 0xFFFF0000) | 0x00008E00;
  }
  asm volatile("lidt %0" : : "m"(idt_ptr));
}

static int div0() {
  volatile int divisor = 0;
  volatile int result = 100 / divisor;
  return result;
}
static void pic_remap(void) {
    outb(0x20, 0x11); outb(0xA0, 0x11);  // ICW1
    outb(0x21, 0x20); outb(0xA1, 0x28);  // ICW2: remap master→32, slave→40
    outb(0x21, 0x04); outb(0xA1, 0x02);  // ICW3: cascade
    outb(0x21, 0x01); outb(0xA1, 0x01);  // ICW4: 8086 mode
    outb(0x21, 0xFC); outb(0xA1, 0xFF);  // mask all except IRQ0+IRQ1
}
static void __attribute((used))
kmain(mbi_t *mbi) {
    log_init();
    if (!(mbi->flags & (1 << 6))) return log("no mmap\n", 0);
    mmap_t *e   = (mmap_t *)(uintptr_t)mbi->mmap_addr;
    mmap_t *end = (mmap_t *)(uintptr_t)(mbi->mmap_addr + mbi->mmap_length);
    while (e < end) {
        log("base:0x%x length:0x%x type:%u\n", (uint32_t)e->base, (uint32_t)e->length, e->type);
        e = (mmap_t *)((uintptr_t)e + e->size + sizeof(e->size));
    }
    asm volatile("cli");
    load_idt();
    pic_remap();
    asm volatile("sti");
    div0();
    div0();
    div0();
    div0();
    while(1);
}
void __attribute__((naked, section(".text.start")))
_start(void) {
  __asm__ volatile (
      "cli\n"
      "movl %0, %%esp\n"
      "push %%ebx\n"
      "call kmain\n"
      "cli\n"
      "0: hlt\n"
      "jmp 0b\n"
      :: "i"(stack + sizeof(stack))
      );
}
