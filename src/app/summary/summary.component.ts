import { Component, OnInit } from '@angular/core';
import { configuration } from 'src/app/configuration/configuration';
import { tasks } from '../configuration/tasks';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.less'],
  standalone: false,
})
export class SummaryComponent implements OnInit {
  expectedResult: number = 0;
  images: Map<number, string> = new Map([
    [1, 'you.png'],
    [2, 'shame.jpg'],
    [3, 'bad.mp4'],
    [4, 'okay.jpg'],
    [5, 'malle_pretty_good.webp'],
    [6, 'huha.jpg'],
  ]);
  maxPoints: number = 50;
  minRequiredPercentage: number = 0.4;
  thresholdDifference: number = 0.15;
  constructor() {}

  ngOnInit(): void {
    console.log('expectedResult', this.expectedResult);
    this.expectedResult = configuration.reduce(
      (partialResult, task, currentIndex) => {
        const aPoints = tasks[currentIndex].A.subTasks
          .map((st, index) => ((task.A.subTasks as any)[index + 1] ? st.xp : 0))
          .reduce((pr, nv) => pr + nv);
        const bPoints = tasks[currentIndex].B.subTasks
          .map((st, index) => ((task.B.subTasks as any)[index + 1] ? st.xp : 0))
          .reduce((pr, nv) => pr + nv);
        if (aPoints > bPoints) {
          return partialResult + aPoints + bPoints / 4;
        } else {
          return partialResult + bPoints + aPoints / 4;
        }
      },
      0
    );
  }
}
