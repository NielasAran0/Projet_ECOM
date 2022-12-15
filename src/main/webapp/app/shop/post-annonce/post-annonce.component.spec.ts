import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PostAnnonceComponent } from './post-annonce.component';

describe('PostAnnonceComponent', () => {
  let component: PostAnnonceComponent;
  let fixture: ComponentFixture<PostAnnonceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostAnnonceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostAnnonceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
