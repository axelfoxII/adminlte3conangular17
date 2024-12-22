import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndependienteComponent } from './independiente.component';

describe('IndependienteComponent', () => {
  let component: IndependienteComponent;
  let fixture: ComponentFixture<IndependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndependienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
