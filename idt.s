section .bss
align 4
istack_mem:
  resb 4096
istack_top:

section .data
align 4
global istack
istack dd istack_top

section .text

align 4
iret_error:
  add esp, 4
  iret

align 4
iret_interrupt:
  iret

%macro hand 3
  extern int%3_%2
  pusha
  push esp
  call int%3_%2
  add esp, 4
  popa
  jmp iret_%1
  align 4
%endmacro

global idt_handler_0
global idt_handler_1
global idt_handlers_end

align 4
idt_handler_0:hand interrupt, divide_by_zero,        0
idt_handler_1:hand interrupt, debug,                 1
              hand interrupt, nmi,                   2
              hand interrupt, breakpoint,            3
              hand interrupt, overflow,              4
              hand interrupt, bound_range,           5
              hand interrupt, invalid_opcode,        6
              hand interrupt, device_not_available,  7
              hand error,     double_fault,          8
              hand interrupt, coprocessor_overrun,   9
              hand error,     invalid_tss,           10
              hand error,     segment_not_present,   11
              hand error,     stack_fault,           12
              hand error,     general_protection,    13
              hand error,     page_fault,            14
              hand interrupt, reserved,              15
              hand interrupt, x87_fpu,               16
              hand error,     alignment_check,       17
              hand interrupt, machine_check,         18
              hand interrupt, simd_fpu,              19
              hand interrupt, reserved20,            20
              hand interrupt, reserved21,            21
              hand interrupt, reserved22,            22
              hand interrupt, reserved23,            23
              hand interrupt, reserved24,            24
              hand interrupt, reserved25,            25
              hand interrupt, reserved26,            26
              hand interrupt, reserved27,            27
              hand interrupt, reserved28,            28
              hand interrupt, reserved29,            29
              hand interrupt, reserved30,            30
              hand interrupt, reserved31,            31
              hand interrupt, irq0_timer,            32
              hand interrupt, irq1_keyboard,         33
              hand interrupt, irq2,                  34
              hand interrupt, irq3,                  35
              hand interrupt, irq4,                  36
              hand interrupt, irq5,                  37
              hand interrupt, irq6,                  38
              hand interrupt, irq7,                  39
              hand interrupt, irq8,                  40
              hand interrupt, irq9,                  41
              hand interrupt, irq10,                 42
              hand interrupt, irq11,                 43
              hand interrupt, irq12_mouse,           44
              hand interrupt, irq13,                 45
              hand interrupt, irq14_ata_primary,     46
              hand interrupt, irq15_ata_secondary,   47
idt_handlers_end:
              hand interrupt, implemented, _not

