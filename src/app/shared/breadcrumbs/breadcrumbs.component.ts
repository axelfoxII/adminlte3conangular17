import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent implements OnDestroy {
     
 public titulo!:string;
 public tituloSubs$:Subscription;
 
 

  constructor(private router:Router){

    this.tituloSubs$ = this.getArgumentos().subscribe(({titulo})=>{

      this.titulo = titulo;
      document.title = `AdminLte - ${titulo}`

    })

  }


    ngOnDestroy(): void {
      this.tituloSubs$.unsubscribe();
    }


  getArgumentos(){

    return this.router.events.pipe(

      filter((event:any)=> event instanceof ActivationEnd ),
      filter((event:ActivationEnd)=> event.snapshot.firstChild === null ),
      map((event:ActivationEnd)=> event.snapshot.data)
    );

  }




}
