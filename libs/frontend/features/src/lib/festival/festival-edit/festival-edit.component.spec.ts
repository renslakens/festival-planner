import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FestivalEditComponent } from './festival-edit.component';

describe('FestivalEditComponent', () => {
  let component: FestivalEditComponent;
  let fixture: ComponentFixture<FestivalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestivalEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FestivalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
