SOURCES = $(wildcard *.c *.s)
OBJECTS = $(addsuffix .o,$(basename $(SOURCES)))
CC      = gcc
CFLAGS += -m32 -fno-pic -fno-pie \
          -nostdlib \
					-fno-builtin -fno-stack-protector \
          -nostartfiles -nodefaultlibs \
          -ffreestanding \
          -fno-omit-frame-pointer \
          -O2 \
          -Wall -Wextra -c 
LDFLAGS = -T link.ld -melf_i386
AS      = nasm
ASFLAGS = -f elf32

all: kernel.elf

kernel.elf: $(OBJECTS)
	echo $(OBJECTS)
	ld $(LDFLAGS) $(OBJECTS) -o kernel.elf

myosin.iso: kernel.elf
	mkdir -p iso/boot/grub
	cp kernel.elf iso/boot/kernel.elf
	@echo 'set timeout=0'                    >  iso/boot/grub/grub.cfg
	@echo 'set default=0'                    >> iso/boot/grub/grub.cfg
	@echo 'menuentry "myosin" {'             >> iso/boot/grub/grub.cfg
	@echo '    multiboot /boot/kernel.elf'   >> iso/boot/grub/grub.cfg
	@echo '    boot'                         >> iso/boot/grub/grub.cfg
	@echo '}'                                >> iso/boot/grub/grub.cfg
	grub-mkrescue -o myosin.iso iso 2>/dev/null

run: myosin.iso
	qemu-system-x86_64 -cdrom myosin.iso -serial stdio

%.o: %.c
	$(CC) $(CFLAGS) $< -o $@

%.o: %.s
	$(AS) $(ASFLAGS) $< -o $@

clean:
	rm -rf *.o kernel.elf myosin.iso iso
