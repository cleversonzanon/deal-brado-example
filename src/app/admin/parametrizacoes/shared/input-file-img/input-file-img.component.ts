import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-file-img',
  templateUrl: './input-file-img.component.html',
  styleUrls: ['./input-file-img.component.scss']
})
export class InputFileImgComponent implements OnInit {
  @Input() placeholder: string;
  @Input() color: string;
  imgFile: File;

  constructor() {
  }

  ngOnInit() {
  }

}
