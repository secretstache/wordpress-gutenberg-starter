/**
 * Minimal className joiner — filter falsy values and join with a space.
 * Drop-in for clsx/classnames without an extra dependency.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
