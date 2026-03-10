#!/bin/bash
set -e

nasm -f elf32 loader.s
ld -T link.ld -melf_i386 loader.o -o kernel.elf

rm -rf iso
mkdir -p iso/boot/grub
cp kernel.elf iso/boot/

cat > iso/boot/grub/grub.cfg << EOF
set timeout=3
set default=0
menuentry "myosin" {
    multiboot /boot/kernel.elf
    boot
}
EOF

grub-mkrescue -o myosin.iso iso 2>/dev/null
qemu-system-x86_64 -cdrom myosin.iso -debugcon stdio
