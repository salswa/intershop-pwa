import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaComponent } from 'ng-recaptcha';
import { EMPTY, of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CaptchaFacade } from '../../../facades/captcha.facade';
import { CaptchaV2Component, CaptchaV2ComponentModule } from '../../../shared/captcha/captcha-v2/captcha-v2.component';
import { CaptchaV3Component, CaptchaV3ComponentModule } from '../../../shared/captcha/captcha-v3/captcha-v3.component';

import { LazyCaptchaComponent } from './lazy-captcha.component';

describe('Lazy Captcha Component', () => {
  let fixture: ComponentFixture<LazyCaptchaComponent>;
  let component: LazyCaptchaComponent;
  let element: HTMLElement;
  let captchaFacade: CaptchaFacade;

  beforeEach(async(() => {
    captchaFacade = mock(CaptchaFacade);
    when(captchaFacade.captchaVersion$).thenReturn(EMPTY);
    when(captchaFacade.captchaSiteKey$).thenReturn(of('captchaSiteKeyASDF'));
    when(captchaFacade.captchaActive$(anyString())).thenReturn(of(true));

    TestBed.configureTestingModule({
      declarations: [MockComponent(RecaptchaComponent)],
      imports: [
        CaptchaV2ComponentModule,
        CaptchaV3ComponentModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: { configuration: configurationReducer },
        }),
      ],
      providers: [
        { provide: CaptchaFacade, useFactory: () => instance(captchaFacade) },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'captchaSiteKeyQWERTY' },
      ],
    })
      .overrideModule(CaptchaV2ComponentModule, { set: { entryComponents: [CaptchaV2Component] } })
      .overrideModule(CaptchaV3ComponentModule, { set: { entryComponents: [CaptchaV3Component] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyCaptchaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.form = new FormGroup({
      captcha: new FormControl(''),
      captchaAction: new FormControl(''),
    });
    component.cssClass = 'd-none';
    component.topic = 'register';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render v2 component when configured', fakeAsync(() => {
    when(captchaFacade.captchaVersion$).thenReturn(of(2 as 2));
    fixture.detectChanges();

    tick(500);
    expect(element).toMatchInlineSnapshot(`<ish-captcha-v2></ish-captcha-v2>`);
    const v2Cmp: CaptchaV2Component = fixture.debugElement.query(By.css('ish-captcha-v2'))?.componentInstance;
    expect(v2Cmp).toBeTruthy();
    expect(v2Cmp.cssClass).toEqual('d-none');
  }));
  it('should render v3 component when configured', fakeAsync(() => {
    when(captchaFacade.captchaVersion$).thenReturn(of(3 as 3));
    fixture.detectChanges();

    tick(500);
    expect(element).toMatchInlineSnapshot(`<ish-captcha-v3></ish-captcha-v3>`);
    const v3Cmp: CaptchaV3Component = fixture.debugElement.query(By.css('ish-captcha-v3'))?.componentInstance;
    expect(v3Cmp).toBeTruthy();
  }));

  // errors are thrown if required input parameters are missing
  it('should throw an error if there is no form set as input parameter', () => {
    component.form = undefined;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"required input parameter <form> is missing for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captcha" in the given form', () => {
    delete component.form.controls.captcha;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captcha' does not exist in the given form for LazyCaptchaComponent"`
    );
  });

  it('should throw an error if there is no control "captchaAction" in the given form', () => {
    delete component.form.controls.captchaAction;
    expect(() => fixture.detectChanges()).toThrowErrorMatchingInlineSnapshot(
      `"form control 'captchaAction' does not exist in the given form for LazyCaptchaComponent"`
    );
  });
});