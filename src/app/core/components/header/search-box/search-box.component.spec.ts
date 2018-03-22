import { ChangeDetectionStrategy, SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';
import { SearchBoxComponent } from './search-box.component';

describe('Search Box Component', () => {
  let fixture: ComponentFixture<SearchBoxComponent>;
  let component: SearchBoxComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBoxComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
    }).overrideComponent(SearchBoxComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  function triggerSearch(term: string, results: SuggestTerm[]) {
    component.results = results;
    component.searchTerm = term;
    fixture.detectChanges();
    component.ngOnChanges({
      results: { currentValue: results } as SimpleChange,
      searchTerm: { currentValue: term } as SimpleChange,
    } as SimpleChanges);
    fixture.detectChanges();
  }

  it('should fire event when search is called', () => {
    let term: string;
    component.searchTermChange.subscribe(searchTerm => term = searchTerm);

    component.search('test');
    expect(term).toEqual('test');
  });

  describe('with no results', () => {
    beforeEach(() => {
      triggerSearch('', []);
    });

    it('should show no results when no suggestions are found', () => {
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

      expect(ul).toBeFalsy();
    });

    it('should hide popup when no search results are found', () => {
      expect(component.isHidden).toBe(true);
    });
  });

  describe('with results', () => {
    beforeEach(() => {
      triggerSearch('cam', [
        { term: 'Cameras', type: undefined },
        { term: 'Camcorders', type: undefined },
      ]);
    });

    it('should show results when suggestions are available', fakeAsync(() => {
      const ul = element.querySelector<HTMLUListElement>('.search-suggest-results');

      expect(ul.querySelectorAll('li').length).toBe(2);
    }));

    it('should show popup when search results are found', () => {
      expect(component.isHidden).toBe(false);
    });
  });

  describe('with inputs', () => {
    it('should show button text when buttonText is set', () => {
      component.buttonText = 'buttonTextInput';
      fixture.detectChanges();
      const button = element.querySelector<HTMLButtonElement>('.btn-search');
      expect(button.innerText).toBe(component.buttonText);
    });
    it('should show button title text when buttonTitleText is set', () => {
      component.buttonTitleText = 'buttonTitleTextInput';
      fixture.detectChanges();
      const button = element.querySelector<HTMLButtonElement>('.btn-search');
      expect(button.getAttribute('title')).toBe(component.buttonTitleText);
    });
    it('should show placeholder text when placeholderText is set', () => {
      component.placeholderText = 'placeholderTextInput';
      fixture.detectChanges();
      const inputElement = element.querySelector<HTMLInputElement>('.searchTerm');
      expect(inputElement.getAttribute('placeholder')).toBe(component.placeholderText);
    });
  });
});
