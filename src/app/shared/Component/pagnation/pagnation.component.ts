import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-pagnation',
  templateUrl: './pagnation.component.html',
  styleUrl: './pagnation.component.scss'
})
export class PagnationComponent {
@Input()pageSize:number

@Input()totalCount:number

@Output()pageChanged=new EventEmitter()

OnChangePage(ev:any){
  this.pageChanged.emit(ev)
}
}
