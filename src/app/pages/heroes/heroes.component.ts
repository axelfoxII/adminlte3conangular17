
import { AfterViewInit, Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HeroesService } from '../../services/heroes.service';
import { Heroes } from '../../interfaces/heroes.interface';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit, AfterViewInit {


  heroes: Heroes[] = [];
  dataSource!: MatTableDataSource<Heroes>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private heroesSvc: HeroesService) { }

  ngOnInit() {
    // Obtener los datos de héroes y configurar las columnas
    this.heroesSvc.obtenerHeroes().subscribe(heroesData => {
      this.heroes = heroesData;
      this.dataSource = new MatTableDataSource(this.heroes);
      console.log(this.heroes);

      // Si dataSource está definido, asigna el paginador
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    // Si dataSource ya está definido, asigna el paginador
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  displayedColumns: string[] = ['imagen', 'superhero', 'first_appearance', 'publisher', 'actions'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  
}
