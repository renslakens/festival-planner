import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketMyListComponent } from './ticket-my-list.component';

describe('TicketMyListComponent', () => {
  let component: TicketMyListComponent;
  let fixture: ComponentFixture<TicketMyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketMyListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketMyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
