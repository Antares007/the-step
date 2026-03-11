#include <stdarg.h>
static void write_str(char *buf, unsigned int *pos, unsigned int size, const char *s) {
    while (*s && *pos < size - 1) buf[(*pos)++] = *s++;
}
static void write_uint(char *buf, unsigned int *pos, unsigned int size,
                       unsigned long v, int base) {
    const char *hex = "0123456789abcdef";
    char tmp[32]; int n = 0;
    if (!v) { if (*pos < size-1) buf[(*pos)++] = '0'; return; }
    while (v) { tmp[n++] = hex[v % base]; v /= base; }
    while (n > 0 && *pos < size - 1) buf[(*pos)++] = tmp[--n];
}
int kvsnprintf(char *buf, unsigned int size, const char *fmt, va_list ap) {
    unsigned int pos = 0;
    for (; *fmt && pos < size - 1; fmt++) {
        if (*fmt != '%') { buf[pos++] = *fmt; continue; }
        fmt++;
        switch (*fmt) {
          case 's': {
                      const char *s = va_arg(ap, const char *);
                      if (!s) s = "(null)";
                      write_str(buf, &pos, size, s);
                      break;
                    }
            case 'c': buf[pos++] = (char)va_arg(ap, int); break;
            case 'd': {
                long v = va_arg(ap, int);
                if (v < 0 && pos < size-1) { buf[pos++] = '-'; v = -v; }
                write_uint(buf, &pos, size, (unsigned long)v, 10);
                break;
            }
            case 'u': write_uint(buf, &pos, size, va_arg(ap, unsigned), 10); break;
            case 'x': write_uint(buf, &pos, size, va_arg(ap, unsigned), 16); break;
            case 'p': 
                write_str(buf, &pos, size, "0x");
                write_uint(buf, &pos, size, (unsigned long)va_arg(ap, void*), 16); break;
            case '%': buf[pos++] = '%'; break;
        }
    }
    buf[pos] = '\0';
    return (int)pos;
}
int ksnprintf(char *buf, unsigned int size, const char *fmt, ...) {
    va_list ap;
    va_start(ap, fmt);
    int r = kvsnprintf(buf, size, fmt, ap);
    va_end(ap);
    return r;
}
