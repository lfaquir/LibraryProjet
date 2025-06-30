import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../services/statistic/statistic.service';
import { Statistic } from '../../../model/statistic';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [NgIf],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent implements OnInit  {

  showStatisticModal: boolean = true;


  stats!: Statistic;

  constructor(private statisticService: StatisticService, private router: Router){}

  ngOnInit(): void{
    this.getStatistic();
  }

  getStatistic(){
    this.statisticService.getStatistics().subscribe( data=>
    {
      this.stats = data;
      console.log("donnees :",data)
    })
  }

  navigateTo(page: string){
    this.router.navigate([`/${page}`]);
  }
}
