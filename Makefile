CC      = gcc
CFLAGS += -m32 -fno-pic -fno-pie \
          -nostdlib \
					-fno-builtin -fno-stack-protector \
          -nostartfiles -nodefaultlibs \
          -ffreestanding \
          -fno-omit-frame-pointer \
          -O2 \
          -fno-asynchronous-unwind-tables \
          -fno-ident \
          -Wa,--noexecstack \
          -Wall -Wextra -Wno-unused-parameter -c 
LDFLAGS = -T link.ld -melf_i386
AS      = nasm
ASFLAGS = -f elf32

all: mb

mb.elf: mb.o mb.ld
	ld -m elf_i386 -T mb.ld mb.o -o mb.elf -o mb.elf
mb.iso: mb.elf
	mkdir -p iso/boot/grub
	cp mb.elf iso/boot/mb.elf
	@echo 'set timeout=0'                >  iso/boot/grub/grub.cfg
	@echo 'set default=0'                >> iso/boot/grub/grub.cfg
	@echo 'menuentry "mb" {'             >> iso/boot/grub/grub.cfg
	@echo '    multiboot /boot/mb.elf'   >> iso/boot/grub/grub.cfg
	@echo '    boot'                     >> iso/boot/grub/grub.cfg
	@echo '}'                            >> iso/boot/grub/grub.cfg
	grub-mkrescue -o mb.iso iso 2>/dev/null
mb: mb.iso
	qemu-system-i386 -cdrom mb.iso -serial stdio

%.o: %.c
	$(CC) $(CFLAGS) $< -o $@

%.o: %.s
	$(AS) $(ASFLAGS) $< -o $@

clean:
	rm -rf *.o mb.elf mb.iso iso
