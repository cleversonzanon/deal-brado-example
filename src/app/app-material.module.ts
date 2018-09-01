import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CovalentFileModule, CovalentLayoutModule } from '@covalent/core';

@NgModule({
  exports: [
    CdkTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatChipsModule,
    MatTableModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    MatSliderModule,
    CovalentLayoutModule,
    CovalentFileModule
  ]
})
export class AppMaterialModule {
}
