import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemindependienteComponent } from './itemindependiente.component';

describe('ItemindependienteComponent', () => {
  let component: ItemindependienteComponent;
  let fixture: ComponentFixture<ItemindependienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemindependienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemindependienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
