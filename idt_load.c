static unsigned int idt[512] = {0};
static struct {
  short limit;
  unsigned int base;
} __attribute__((packed)) idt_ptr = {.limit = 256 * 8 - 1, .base = (unsigned int)idt};

static void set_gate(int n, unsigned int handler) {
  idt[n * 2 + 0] = (0x0008 << 16) | (handler & 0xFFFF);
  idt[n * 2 + 1] = (handler & 0xFFFF0000) | 0x00008E00;
}

extern char idt_handler_0;
extern char idt_handler_1;
extern char idt_handlers_end;
void idt_load() {
  int stride = &idt_handler_1 - &idt_handler_0;
  int count = (&idt_handlers_end - &idt_handler_0) / stride;
  int i = 0;
  for (; i < count; i++) set_gate(i, (unsigned int)&idt_handler_0 + stride * i);
  for (; i < 256; i++) set_gate(i, (unsigned int)&idt_handlers_end);
  asm volatile("lidt %0" : : "m"(idt_ptr));
}
