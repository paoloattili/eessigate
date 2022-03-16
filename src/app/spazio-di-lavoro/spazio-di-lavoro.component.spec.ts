/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpazioDiLavoroComponent } from './spazio-di-lavoro.component';

describe('SpazioDiLavoroComponent', () => {
  let component: SpazioDiLavoroComponent;
  let fixture: ComponentFixture<SpazioDiLavoroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpazioDiLavoroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpazioDiLavoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
