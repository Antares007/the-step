#include <stdint.h>
struct __attribute__((packed)) pusha_regs {
  uint32_t edi, esi, ebp, esp, ebx, edx, ecx, eax;
};
struct __attribute__((packed)) cpu_frame {
  uint32_t eip, cs, eflags;
};
typedef struct __attribute__((packed)) interrupt_ctx {
  struct pusha_regs regs;
  struct cpu_frame frame;
} interrupt_ctx;
typedef struct __attribute__((packed)) interrupt_ctx_err {
  struct pusha_regs regs;
  uint32_t error_code;
  struct cpu_frame frame;
} interrupt_ctx_err;

void myosin_log(const char *fmt, ...);
#define P myosin_log("%s 0x%x\n", __func__, ctx)

void int0_divide_by_zero(interrupt_ctx *ctx) {
  ctx->frame.eip += 2;
  ctx->regs.eax = 0;
  ctx->regs.edx = 0;
  P;
}
void int1_debug(interrupt_ctx *ctx) { P; }
void int2_nmi(interrupt_ctx *ctx) { P; }
void int3_breakpoint(interrupt_ctx *ctx) { P; }
void int4_overflow(interrupt_ctx *ctx) { P; }
void int5_bound_range(interrupt_ctx *ctx) { P; }
void int6_invalid_opcode(interrupt_ctx *ctx) { P; }
void int7_device_not_available(interrupt_ctx *ctx) { P; }
void int8_double_fault(interrupt_ctx_err *ctx) { P; }
void int9_coprocessor_overrun(interrupt_ctx *ctx) { P; }
void int10_invalid_tss(interrupt_ctx_err *ctx) { P; }
void int11_segment_not_present(interrupt_ctx_err *ctx) { P; }
void int12_stack_fault(interrupt_ctx_err *ctx) { P; }
void int13_general_protection(interrupt_ctx *ctx) { P; }
void int14_page_fault(interrupt_ctx_err *ctx) { P; }
void int15_reserved(interrupt_ctx *ctx) { P; }
void int16_x87_fpu(interrupt_ctx *ctx) { P; }
void int17_alignment_check(interrupt_ctx_err *ctx) { P; }
void int18_machine_check(interrupt_ctx *ctx) { P; }
void int19_simd_fpu(interrupt_ctx *ctx) { P; }
void int20_reserved20(interrupt_ctx *ctx) { P; }
void int21_reserved21(interrupt_ctx *ctx) { P; }
void int22_reserved22(interrupt_ctx *ctx) { P; }
void int23_reserved23(interrupt_ctx *ctx) { P; }
void int24_reserved24(interrupt_ctx *ctx) { P; }
void int25_reserved25(interrupt_ctx *ctx) { P; }
void int26_reserved26(interrupt_ctx *ctx) { P; }
void int27_reserved27(interrupt_ctx *ctx) { P; }
void int28_reserved28(interrupt_ctx *ctx) { P; }
void int29_reserved29(interrupt_ctx *ctx) { P; }
void int30_reserved30(interrupt_ctx *ctx) { P; }
void int31_reserved31(interrupt_ctx *ctx) { P; }
void int32_irq0_timer(interrupt_ctx *ctx) { P; }
void int33_irq1_keyboard(interrupt_ctx *ctx) { P; }
void int34_irq2(interrupt_ctx *ctx) { P; }
void int35_irq3(interrupt_ctx *ctx) { P; }
void int36_irq4(interrupt_ctx *ctx) { P; }
void int37_irq5(interrupt_ctx *ctx) { P; }
void int38_irq6(interrupt_ctx *ctx) { P; }
void int39_irq7(interrupt_ctx *ctx) { P; }
void int40_irq8(interrupt_ctx *ctx) { P; }
void int41_irq9(interrupt_ctx *ctx) { P; }
void int42_irq10(interrupt_ctx *ctx) { P; }
void int43_irq11(interrupt_ctx *ctx) { P; }
void int44_irq12_mouse(interrupt_ctx *ctx) { P; }
void int45_irq13(interrupt_ctx *ctx) { P; }
void int46_irq14_ata_primary(interrupt_ctx *ctx) { P; }
void int47_irq15_ata_secondary(interrupt_ctx *ctx) { P; }
void int_not_implemented(interrupt_ctx *ctx) { P;
  myosin_log("eax: 0x%x\n", ctx->regs.eax);
  myosin_log("ebp: 0x%x\n", ctx->regs.ebp);
  myosin_log("ebx: 0x%x\n", ctx->regs.ebx);
  myosin_log("ecx: 0x%x\n", ctx->regs.ecx);
  myosin_log("edi: 0x%x\n", ctx->regs.edi);
  myosin_log("edx: 0x%x\n", ctx->regs.edx);
  myosin_log("esi: 0x%x\n", ctx->regs.esi);
  myosin_log("esp: 0x%x\n", ctx->regs.esp);
}
