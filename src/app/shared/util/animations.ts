import { animate, group, state, style, transition } from '@angular/animations';

export class Animations {
  static slideInOut = [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [
      style({ height: '*', opacity: 1 }),

      group([
        animate(300, style({ height: 0 })),
        animate('200ms ease-in-out', style({ 'opacity': '0' }))
      ])

    ]),
    transition(':enter', [
      style({ height: '0', opacity: 0 }),

      group([
        animate(300, style({ height: '*' })),
        animate('400ms ease-in-out', style({ 'opacity': '1' }))
      ])

    ])
  ];
}
