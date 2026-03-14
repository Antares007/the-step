        #include "io.h"
        #include <stdint.h>
        struct __attribute__((packed)) pusha_regs {
          uint32_t edi, esi, ebp, esp, ebx, edx, ecx, eax;
        };
        struct __attribute__((packed)) cpu_frame {
          uint32_t eip, cs, eflags;
        };
        typedef struct __attribute__((packed)) ι {
          struct pusha_regs regs;
          struct cpu_frame frame;
        } ι;
        typedef struct __attribute__((packed)) interrupt_ctx_err {
          struct pusha_regs regs;
          uint32_t error_code;
          struct cpu_frame frame;
        } interrupt_ctx_err;
        
        static inline void pic_eoi(unsigned char irq) {
            if (irq >= 8) outb(0xA0, 0x20);
            outb(0x20, 0x20);
        }
        
        void myosin_log(const char *fmt, ...);
        #define P myosin_log("%s 0x%x\n", __func__, c)
        
        void int0_divide_by_zero(ι *c) {
          P;
          myosin_log("eip:%x\n", c->frame.eip);
          c->frame.eip += 2;
          c->regs.eax = 0;
          c->regs.edx = 0;
        }
        void int1_debug(ι *c) { P; }
        void int2_nmi(ι *c) { P; }
        void int3_breakpoint(ι *c) { P; }
        void int4_overflow(ι *c) { P; }
        void int5_bound_range(ι *c) { P; }
        void int6_invalid_opcode(ι *c) { P; while(1); }
        void int7_device_not_available(ι *c) { P; }
        void int8_double_fault(interrupt_ctx_err *c) { P; }
        void int9_coprocessor_overrun(ι *c) { P; }
        void int10_invalid_tss(interrupt_ctx_err *c) { P; }
        void int11_segment_not_present(interrupt_ctx_err *c) { P; }
        void int12_stack_fault(interrupt_ctx_err *c) { P; }
        void int13_general_protection(ι *c) { P; }
        void int14_page_fault(interrupt_ctx_err *c) { P; }
        void int15_reserved(ι *c) { P; }
        void int16_x87_fpu(ι *c) { P; }
        void int17_alignment_check(interrupt_ctx_err *c) { P; }
        void int18_machine_check(ι *c) { P; }
        void int19_simd_fpu(ι *c) { P; }
        void int20_reserved20(ι *c) { P; }
        void int21_reserved21(ι *c) { P; }
        void int22_reserved22(ι *c) { P; }
        void int23_reserved23(ι *c) { P; }
        void int24_reserved24(ι *c) { P; }
        void int25_reserved25(ι *c) { P; }
        void int26_reserved26(ι *c) { P; }
        void int27_reserved27(ι *c) { P; }
        void int28_reserved28(ι *c) { P; }
        void int29_reserved29(ι *c) { P; }
        void int30_reserved30(ι *c) { P; }
        void int31_reserved31(ι *c) { P; }
        void int32_irq0_timer(ι *c) { (void)c, pic_eoi(0); }
        
        typedef struct {
            unsigned char code;
            unsigned char extended;
            unsigned char released;
        } key_event;
        typedef struct ψ  ψ;
        typedef struct Δ Δ;
        typedef struct δ δ;
        struct ψ { void(*step)(void*, unsigned char, Δ, δ); };
        struct Δ { void(*step)(void*, key_event, ψ); };
        struct δ { void(*step)(void*, ψ); };
        void s_idle(void*, unsigned char byte, Δ dispatch, δ d);
        void s_pause_5(void*o, unsigned char byte, Δ dispatch, δ d) {
          if (byte == 0xC5)
            dispatch.step(
                o,
                (key_event){.code = 0x45, .extended = 1, .released = 0},
                (ψ){s_idle});
          else d.step(o, (ψ){s_idle});
        }
        void s_pause_4(void*o, unsigned char byte, Δ dispatch, δ d) {
          d.step(o, (ψ){(byte == 0x9D) ? s_pause_5 : s_idle});
        }
        void s_pause_3(void*o, unsigned char byte, Δ dispatch, δ d) {
          d.step(o, (ψ){(byte == 0xE1) ? s_pause_4 : s_idle});
        }
        void s_pause_2(void*o, unsigned char byte, Δ dispatch, δ d) {
          d.step(o, (ψ){(byte == 0x45) ? s_pause_3 : s_idle});
        }
        void s_pause_1(void*o, unsigned char byte, Δ dispatch, δ d) {
          d.step(o, (ψ){(byte == 0x1D) ? s_pause_2 : s_idle});
        }
        void s_extended(void*o, unsigned char byte, Δ dispatch, δ d) {
          dispatch.step(
              o,
              (key_event){.code     = byte & 0x7f,
              .released = byte & 0x80,
              .extended = 1},
              (ψ){s_idle}
              );
        }
        void s_idle(void*o, unsigned char byte, Δ dispatch, δ d) {
          if      (byte == 0xE0) d.step(o, (ψ){s_extended});
          else if (byte == 0xE1) d.step(o, (ψ){s_pause_1});
          else dispatch.step(
              o,
              (key_event){.code     = byte & 0x7f,
              .released = byte & 0x80,
              .extended = 0},
              (ψ){s_idle}
              );
        }
        static ψ s = {s_idle};
        void dispatch(void*o,key_event ev, ψ sprime) {
          myosin_log("%x, %d %d\n", ev.code, ev.extended, ev.released);
          s = sprime;
          ((void(*)())o)();
        
        }
        void gotons(void*o, ψ ns) {
          s = ns;
          pic_eoi(1);
          ((void(*)())o)();
        }
        void ack_pic1(){ pic_eoi(1); }
        void int33_irq1_keyboard() {
          s.step(ack_pic1,inb(0x60), (Δ){dispatch}, (δ){gotons});
        }
        
        void int_33_irq1_keyboard(ι *c) {
          P;
          unsigned char sc = inb(0x60);
          myosin_log("key: 0x%x 0x%x\n", sc, sc & ~0x80); 
          pic_eoi(1);
        }
        void int34_irq2(ι *c) { P;pic_eoi(2); }
        void int35_irq3(ι *c) { P;pic_eoi(3); }
        void int36_irq4(ι *c) { P;pic_eoi(4); }
        void int37_irq5(ι *c) { P;pic_eoi(5); }
        void int38_irq6(ι *c) { P;pic_eoi(6); }
        void int39_irq7(ι *c) { P;pic_eoi(7); }
        void int40_irq8(ι *c) { P;pic_eoi(8); }
        void int41_irq9(ι *c) { P;pic_eoi(9); }
        void int42_irq10(ι *c) { P;pic_eoi(10); }
        void int43_irq11(ι *c) { P;pic_eoi(11); }
        void int44_irq12_mouse(ι *c) { P;pic_eoi(12); }
        void int45_irq13(ι *c) { P;pic_eoi(13); }
        void int46_irq14_ata_primary(ι *c) { P;pic_eoi(14); }
        void int47_irq15_ata_secondary(ι *c) { P;pic_eoi(15); }
        void int_not_implemented(ι *c) { P;
          myosin_log("eax: 0x%x\n", c->regs.eax);
          myosin_log("ebp: 0x%x\n", c->regs.ebp);
          myosin_log("ebx: 0x%x\n", c->regs.ebx);
          myosin_log("ecx: 0x%x\n", c->regs.ecx);
          myosin_log("edi: 0x%x\n", c->regs.edi);
          myosin_log("edx: 0x%x\n", c->regs.edx);
          myosin_log("esi: 0x%x\n", c->regs.esi);
          myosin_log("esp: 0x%x\n", c->regs.esp);
        }
