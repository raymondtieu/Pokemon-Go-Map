import { Directive, ElementRef } from '@angular/core';

/*
  Generated class for the Timer directive.

  See https://angular.io/docs/ts/latest/api/core/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[timer]' // Attribute selector
})
export class Timer {
  ticking: boolean = false;

  constructor(private element: ElementRef) {
    console.log("ASDFSADFDSAFADSFADSFAASASD");
    console.log(element);
  }
}
