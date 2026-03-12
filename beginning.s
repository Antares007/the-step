    global loader                   ; the entry symbol for ELF


    MAGIC_NUMBER equ 0x1BADB002     ; define the magic number constant
    FLAGS        equ 0x0            ; multiboot flags
    CHECKSUM     equ -MAGIC_NUMBER  ; calculate the checksum
                                    ; (magic number + checksum + flags should equal 0)

    KERNEL_STACK_SIZE equ 0x10000   ; size of stack in bytes

    section .bss
    align 4                         ; align at 4 bytes
    kernel_stack:                   ; label points to beginning of memory
        resb KERNEL_STACK_SIZE      ; reserve stack for the kernel

    section .text                   ; start of the text (code) section
    align 4                         ; the code must be 4 byte aligned
        dd MAGIC_NUMBER             ; write the magic number to the machine code,
        dd FLAGS                    ; the flags,
        dd CHECKSUM                 ; and the checksum

    align 4                         ; the code must be 4 byte aligned
    loader:                         ; the loader label (defined as entry point in linker script)
        cli
        mov esp, kernel_stack + KERNEL_STACK_SIZE

        lgdt [gdtr]
        jmp 0x08:.flush
        .flush:
        mov ax, 0x10
        mov ds, ax
        mov es, ax
        mov fs, ax
        mov gs, ax
        mov ss, ax

        extern idt_load
        call idt_load

        extern myosin
        call myosin
    .loop:
        hlt
        jmp .loop

section .data
align 4
gdt:
dq 0x0000000000000000        ; null descriptor
dq 0x00CF9A000000FFFF        ; kernel code
dq 0x00CF92000000FFFF        ; kernel data
gdt_end:

align 4
gdtr:
dw gdt_end - gdt - 1
dd gdt
