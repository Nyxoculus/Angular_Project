import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskSelectorComponent } from './task-selector/task-selector.component';
import { TaskComponent } from './task/task.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { MarkdownModule } from 'ngx-markdown';
import { Task1AComponent } from './tasks/1/A/task1-a.component';
import { Task1BComponent } from './tasks/1/B/task1-b.component';
import { RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { PreviewComponent } from './preview/preview.component';
import { Task2AComponent } from 'src/app/tasks/2/A/task2-a.component';
import { Task2BComponent } from 'src/app/tasks/2/B/task2-b.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CheckSquareOutline,
  BorderOutline,
} from '@ant-design/icons-angular/icons';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { NZ_I18N, hu_HU } from 'ng-zorro-antd/i18n';

registerLocaleData(localeHu);

const zorroModules = [
  NzButtonModule,
  NzCardModule,
  NzDatePickerModule,
  NzDividerModule,
  NzFormModule,
  NzIconModule.forChild([BorderOutline, CheckSquareOutline]),
  NzLayoutModule,
  NzListModule,
  NzMenuModule,
  NzModalModule,
  NzSelectModule,
  NzTableModule,
  NzTabsModule,
  NzTooltipModule,
];

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    NavigatorComponent,
    Task1AComponent,
    Task1BComponent,
    Task2AComponent,
    Task2BComponent,
    TaskSelectorComponent,
    SummaryComponent,
    PreviewComponent,
  ],
  imports: [
    ...zorroModules,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    RouterModule,
  ],
  providers: [
    provideHttpClient(),
    { provide: NZ_I18N, useValue: hu_HU }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}