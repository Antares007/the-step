ENTRY(loader)
SECTIONS {
  . = 0x00100000;
  .ring0 ALIGN(0x1000) : {
    beginning.o (.text, .rodata*, .data, COMMON, .bss)
    idt.o       (.text, .rodata*, .data, COMMON, .bss)
    idt_load.o  (.text, .rodata*, .data, COMMON, .bss)
    ksnprintf.o (.text, .rodata*, .data, COMMON, .bss)
    myosin.o    (.text, .rodata*, .data, COMMON, .bss)
    serial.o    (.text, .rodata*, .data, COMMON, .bss)
    idt_gates.o (.text, .rodata*, .data, COMMON, .bss)
  }
  myosin_free = .;

}
