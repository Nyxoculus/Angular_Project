import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { LogEntry, LogStats } from './log-entry.model';

Chart.register(...registerables);

const LOG_FILES = [
  'assets/logs/event_batch_1.json',
  'assets/logs/event_batch_2.json',
  'assets/logs/event_batch_3.json',
];

const SEVERITIES = ['info', 'warning', 'error'];

function dateRangeValidator(
  group: AbstractControl
): ValidationErrors | null {
  const start = group.get('startDate')?.value as Date | null;
  const end = group.get('endDate')?.value as Date | null;
  if (start && end && start.getTime() > end.getTime()) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'app-task2-a',
  templateUrl: './task2-a.component.html',
  styleUrls: ['./task2-a.component.less'],
  standalone: false,
})
export class Task2AComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('barCanvas') barCanvas?: ElementRef<HTMLCanvasElement>;

  readonly severities = SEVERITIES;

  logs = signal<LogEntry[]>([]);
  filtered = signal<LogEntry[]>([]);
  users = signal<string[]>([]);
  stats = signal<LogStats | null>(null);
  loading = signal<boolean>(true);

  form: FormGroup;

  private worker?: Worker;
  private chart?: Chart;

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        severities: [[] as string[]],
        users: [[] as string[]],
        startDate: [null as Date | null],
        endDate: [null as Date | null],
      },
      { validators: dateRangeValidator }
    );
  }

  ngOnInit(): void {
    this.initWorker();

    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.applyFilter();
      }
    });

    forkJoin(LOG_FILES.map((file) => this.http.get<LogEntry[]>(file))).subscribe({
      next: (batches) => {
        const all = batches.flat();
        this.logs.set(all);
        this.users.set([...new Set(all.map((e) => e.user))].sort());
        this.loading.set(false);
        this.applyFilter();
      },
      error: () => this.loading.set(false),
    });
  }

  ngAfterViewInit(): void {
    if (this.stats()) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
    this.chart?.destroy();
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../../../_workers/log.worker', import.meta.url)
      );
      this.worker.onmessage = ({ data }) => {
        this.stats.set(data as LogStats);
        this.updateChart();
      };
    }
  }

  private applyFilter(): void {
    const { severities, users, startDate, endDate } = this.form.value;
    const startStr = startDate ? this.toDayString(startDate) : null;
    const endStr = endDate ? this.toDayString(endDate) : null;

    const result = this.logs().filter((entry) => {
      if (severities?.length && !severities.includes(entry.severity)) {
        return false;
      }
      if (users?.length && !users.includes(entry.user)) {
        return false;
      }
      const day = (entry.timestamp ?? '').slice(0, 10);
      if (startStr && day < startStr) {
        return false;
      }
      if (endStr && day > endStr) {
        return false;
      }
      return true;
    });

    this.filtered.set(result);
    this.worker?.postMessage(result);
  }

  private toDayString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private updateChart(): void {
    const stats = this.stats();
    if (!this.barCanvas || !stats) {
      return;
    }
    const labels = Object.keys(stats.perDay);
    const values = labels.map((k) => stats.perDay[k]);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: 'Bejegyzések / nap', data: values }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.barCanvas.nativeElement, config);
  }

  resetFilters(): void {
    this.form.reset({
      severities: [],
      users: [],
      startDate: null,
      endDate: null,
    });
  }
}
