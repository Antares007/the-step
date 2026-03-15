ENTRY(_start)
SECTIONS {
    . = 1M;
    .text : { *(.multiboot) *(.text.start) *(.text) }
    .rodata : { *(.rodata) }
    .data   : { *(.data)   }
    .bss    : { *(COMMON) *(.bss) }
}
