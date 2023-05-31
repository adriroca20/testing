import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(private router:Router, private zone:NgZone) { }

  ngOnInit(): void {
  }

  navTo(path:string):void{
    this.zone.run(()=>{
      this.router.navigate([`/${path}`]);
    })
  }
}
