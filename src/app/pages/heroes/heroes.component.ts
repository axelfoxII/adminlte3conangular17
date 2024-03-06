import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HeroesService } from '../services/heroes.service';
import { MatPaginator } from '@angular/material/paginator';
import { Heroes } from '../../interfaces/heroes.interface';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent implements OnInit, AfterViewInit {

  heroes:Heroes[]=[];
  dataSource!:MatTableDataSource<Heroes>;

  @ViewChild(MatPaginator) paginator!:MatPaginator


  constructor(private heroesSvc:HeroesService){ }
  
 
  ngOnInit(): void {
    this.heroesSvc.obtenerHeroes().subscribe(heroesData=>{

      this.heroes = heroesData;
      this.dataSource = new MatTableDataSource(this.heroes);

      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }
    

    })
  }


  ngAfterViewInit(): void {

    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }

  }

  displayedColumns:string[] =['imagen','superhero','first_appearance','publisher'];
  
  applyFilter(event:Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter= filterValue.trim().toLowerCase();

  }

}
 