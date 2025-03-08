import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'username',
  pure: true,
  standalone: true,
})
export class NameShortcutPipe implements PipeTransform {
  transform(fullName: string): string {
    if (!fullName) {
      return '?';
    }

    const names = fullName.split(' ').filter((name) => name !== '');
    const initials = names.map((name) => name.charAt(0).toUpperCase());

    if (initials.length > 3) {
      return initials.slice(0, 3).join('');
    }

    return initials.join('');
  }
}
