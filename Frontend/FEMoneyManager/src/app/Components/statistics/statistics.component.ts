import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { Transaction } from '../../Interfaces/Transaction';
import { Category } from '../../Interfaces/Category';
import { from } from 'rxjs';
import { NotificationsService } from '../../Services/notifications.service';

declare var CanvasJS: any;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  private chart: any;
  transactions: Transaction[] = [];
  categories: Category[] = [];
  baseUrl = 'http://localhost:3000';
  loading = false;

  constructor(
    private apiService: ApiService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories() {
    from(this.apiService.getAll(`${this.baseUrl}/categories`)).subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
        if (this.transactions.length > 0 && this.chart) {
          this.updateChartWithTransactions();
        }
      },
      error: () => {
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a kategóriákat');
      }
    });
  }

  loadTransactions() {
    this.loading = true;
    from(this.apiService.getAll(`${this.baseUrl}/transactions`)).subscribe({
      next: (response: any) => {
        this.transactions = response.data || [];
        this.loading = false;
        if (this.chart && this.categories.length > 0) {
          this.updateChartWithTransactions();
        }
      },
      error: () => {
        this.loading = false;
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a tranzakciókat');
      }
    });
  }

  ngAfterViewInit() {
    if (typeof CanvasJS !== 'undefined') {
      this.initChart();
    } else {
      const checkCanvasJS = setInterval(() => {
        if (typeof CanvasJS !== 'undefined') {
          clearInterval(checkCanvasJS);
          this.initChart();
        }
      }, 100);
    }
  }

  private updateChartWithTransactions() {
    if (!this.chart || this.transactions.length === 0) {
      return;
    }

    const transactionData = this.processTransactionData();
    
    this.chart.options.title.text = "Bevételek és Kiadások";
    this.chart.options.axisX.title = "Kategória";
    this.chart.options.axisX.valueFormatString = "";
    this.chart.options.axisY.title = "Összeg (Log)";
    this.chart.options.axisY2.title = "Összeg";
    
    this.chart.options.data = [
      {
        type: "column",
        showInLegend: true,
        name: "Bevételek",
        color: "#10b981",
        dataPoints: transactionData.income
      },
      {
        type: "column",
        axisYType: "secondary",
        showInLegend: true,
        name: "Kiadások",
        color: "#ef4444",
        dataPoints: transactionData.expense
      }
    ];

    this.chart.render();
  }

  private getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Ismeretlen';
  }

  private processTransactionData(): { income: any[], expense: any[] } {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    this.transactions.forEach((transaction: Transaction) => {
      const categoryId = transaction.categoryID;
      
      if (transaction.type === 'bevétel') {
        const current = incomeMap.get(categoryId) || 0;
        incomeMap.set(categoryId, current + transaction.amount);
      } else {
        const current = expenseMap.get(categoryId) || 0;
        expenseMap.set(categoryId, current + transaction.amount);
      }
    });

    const income: any[] = [];
    const expense: any[] = [];
    let index = 0;

    incomeMap.forEach((amount, categoryId) => {
      income.push({ 
        x: index++, 
        y: amount, 
        label: this.getCategoryName(categoryId) 
      });
    });

    let expenseIndex = 0;
    expenseMap.forEach((amount, categoryId) => {
      expense.push({ 
        x: expenseIndex++, 
        y: amount, 
        label: this.getCategoryName(categoryId) 
      });
    });

    income.sort((a, b) => b.y - a.y);
    expense.sort((a, b) => b.y - a.y);

    return { income, expense };
  }

  private initChart() {
    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      zoomEnabled: true,
      theme: "dark2",
      title: {
        text: "Bevételek és Kiadások"
      },
      axisX: {
        title: "Kategória",
        valueFormatString: "",
        interval: 1
      },
      axisY: {
        logarithmic: true,
        title: "Összeg (Log)",
        titleFontColor: "#6D78AD",
        lineColor: "#6D78AD",
        gridThickness: 0,
        lineThickness: 1,
        labelFormatter: this.addSymbols.bind(this)
      },
      axisY2: {
        title: "Összeg",
        titleFontColor: "#51CDA0",
        logarithmic: false,
        lineColor: "#51CDA0",
        gridThickness: 0,
        lineThickness: 1,
        labelFormatter: this.addSymbols.bind(this)
      },
      legend: {
        verticalAlign: "top",
        fontSize: 16,
        dockInsidePlotArea: true
      },
      data: [{
        type: "column",
        showInLegend: true,
        name: "Bevételek",
        color: "#10b981",
        dataPoints: []
      },
      {
        type: "column",
        axisYType: "secondary",
        showInLegend: true,
        name: "Kiadások",
        color: "#ef4444",
        dataPoints: []
      }]
    });

    this.chart.render();
    
    if (this.transactions.length > 0) {
      this.updateChartWithTransactions();
    }
  }

  private addSymbols(e: any): string {
    const suffixes = ["", "K", "M", "B", "T"];
    const order = Math.max(Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)), 0);
    const suffixOrder = order > suffixes.length - 1 ? suffixes.length - 1 : order;
    const suffix = suffixes[suffixOrder];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order), "#,##0.##") + suffix;
  }
}
