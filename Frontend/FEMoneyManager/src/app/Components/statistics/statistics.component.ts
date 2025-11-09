import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { Transaction } from '../../Interfaces/Transaction';
import { Category } from '../../Interfaces/Category';
import { from } from 'rxjs';
import { NotificationsService } from '../../Services/notifications.service';

declare var CanvasJS: any;

interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
}

interface StatisticsSummary {
  incomeTotal: number;
  expenseTotal: number;
  netBalance: number;
  incomeCount: number;
  expenseCount: number;
  incomeAverage: number;
  expenseAverage: number;
  coverage: number;
}

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
  hasTransactions = false;
  summary: StatisticsSummary = {
    incomeTotal: 0,
    expenseTotal: 0,
    netBalance: 0,
    incomeCount: 0,
    expenseCount: 0,
    incomeAverage: 0,
    expenseAverage: 0,
    coverage: 0
  };
  topIncomeCategories: CategoryBreakdown[] = [];
  topExpenseCategories: CategoryBreakdown[] = [];
  balanceLabel = 'Egyensúly';
  balanceStatusClass = 'balance-neutral';
  private chartData: { income: any[]; expense: any[] } = { income: [], expense: [] };
  readonly skeletonSummaryCards = Array.from({ length: 3 });
  readonly skeletonBreakdownRows = Array.from({ length: 4 });
  readonly skeletonDetailCards = Array.from({ length: 2 });
  readonly skeletonDetailItems = Array.from({ length: 3 });

  constructor(
    private apiService: ApiService,
    private notifications: NotificationsService
  ) {}

  ngOnInit() {
    this.loadStatisticsData();
  }

  private loadStatisticsData() {
    this.loading = true;
    const categoriesRequest = this.apiService.getAll(`${this.baseUrl}/categories`);
    const transactionsRequest = this.apiService.getAll(`${this.baseUrl}/transactions`);

    from(Promise.all([categoriesRequest, transactionsRequest])).subscribe({
      next: ([categoriesResponse, transactionsResponse]) => {
        this.categories = categoriesResponse?.data || [];
        this.transactions = transactionsResponse?.data || [];
        this.loading = false;
        this.recalculateStatistics();
      },
      error: () => {
        this.loading = false;
        this.notifications.show('error', 'Hiba', 'Nem sikerült betölteni a statisztikákat');
        this.resetStatistics();
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
    if (!this.chart) {
      return;
    }

    if (this.chartData.income.length === 0 && this.chartData.expense.length === 0) {
      this.chart.options.data = [
        {
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
        }
      ];
      this.chart.render();
      return;
    }

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
        dataPoints: this.chartData.income
      },
      {
        type: "column",
        axisYType: "secondary",
        showInLegend: true,
        name: "Kiadások",
        color: "#ef4444",
        dataPoints: this.chartData.expense
      }
    ];

    this.chart.render();
  }

  private getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Ismeretlen';
  }

  private processTransactionData(): {
    incomePoints: any[];
    expensePoints: any[];
    incomeMap: Map<string, number>;
    expenseMap: Map<string, number>;
    incomeTotal: number;
    expenseTotal: number;
    incomeCount: number;
    expenseCount: number;
  } {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();
    let incomeTotal = 0;
    let expenseTotal = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    this.transactions.forEach((transaction: Transaction) => {
      const categoryId = transaction.categoryID;
      
      if (transaction.type === 'bevétel') {
        const current = incomeMap.get(categoryId) || 0;
        incomeMap.set(categoryId, current + transaction.amount);
        incomeTotal += transaction.amount;
        incomeCount += 1;
      } else {
        const current = expenseMap.get(categoryId) || 0;
        expenseMap.set(categoryId, current + transaction.amount);
        expenseTotal += transaction.amount;
        expenseCount += 1;
      }
    });

    const incomePoints = Array.from(incomeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId, amount], index) => ({
        x: index,
        y: amount,
        label: this.getCategoryName(categoryId)
      }));

    const expensePoints = Array.from(expenseMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId, amount], index) => ({
        x: index,
        y: amount,
        label: this.getCategoryName(categoryId)
      }));

    return { 
      incomePoints, 
      expensePoints, 
      incomeMap, 
      expenseMap, 
      incomeTotal, 
      expenseTotal,
      incomeCount,
      expenseCount
    };
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

  private recalculateStatistics() {
    if (!this.transactions || this.transactions.length === 0) {
      this.resetStatistics();
      this.updateChartWithTransactions();
      return;
    }

    const {
      incomePoints,
      expensePoints,
      incomeMap,
      expenseMap,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    } = this.processTransactionData();

    this.hasTransactions = true;
    this.summary.incomeTotal = incomeTotal;
    this.summary.expenseTotal = expenseTotal;
    this.summary.netBalance = incomeTotal - expenseTotal;
    this.summary.incomeCount = incomeCount;
    this.summary.expenseCount = expenseCount;
    this.summary.incomeAverage = incomeCount ? incomeTotal / incomeCount : 0;
    this.summary.expenseAverage = expenseCount ? expenseTotal / expenseCount : 0;
    this.summary.coverage = expenseTotal === 0 ? 100 : Math.round((incomeTotal / expenseTotal) * 100);

    this.topIncomeCategories = this.mapToBreakdown(incomeMap, incomeTotal);
    this.topExpenseCategories = this.mapToBreakdown(expenseMap, expenseTotal);

    this.balanceStatusClass = this.getBalanceStatusClass(this.summary.netBalance);
    this.balanceLabel = this.getBalanceLabel(this.summary.netBalance);

    this.chartData = {
      income: incomePoints,
      expense: expensePoints
    };

    this.updateChartWithTransactions();
  }

  private resetStatistics() {
    this.hasTransactions = false;
    this.summary = {
      incomeTotal: 0,
      expenseTotal: 0,
      netBalance: 0,
      incomeCount: 0,
      expenseCount: 0,
      incomeAverage: 0,
      expenseAverage: 0,
      coverage: 0
    };
    this.topIncomeCategories = [];
    this.topExpenseCategories = [];
    this.balanceLabel = 'Nincs adat';
    this.balanceStatusClass = 'balance-neutral';
    this.chartData = { income: [], expense: [] };
  }

  private mapToBreakdown(map: Map<string, number>, total: number): CategoryBreakdown[] {
    if (map.size === 0) {
      return [];
    }

    return Array.from(map.entries())
      .map(([categoryId, amount]) => ({
        name: this.getCategoryName(categoryId),
        amount,
        percentage: total === 0 ? 0 : Math.round((amount / total) * 100)
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  private getBalanceStatusClass(netBalance: number): string {
    if (netBalance > 0) {
      return 'balance-positive';
    }

    if (netBalance < 0) {
      return 'balance-negative';
    }

    return 'balance-neutral';
  }

  private getBalanceLabel(netBalance: number): string {
    if (netBalance > 0) {
      return 'Többlet';
    }

    if (netBalance < 0) {
      return 'Hiány';
    }

    return 'Egyensúly';
  }
}
