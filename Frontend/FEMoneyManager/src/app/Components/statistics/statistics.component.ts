import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../Services/api.service';
import { Transaction } from '../../Interfaces/Transaction';
import { Category } from '../../Interfaces/Category';
import { CategoryBreakdown } from '../../Interfaces/CategoryBreakdown';
import { StatisticsSummary } from '../../Interfaces/StatisticsSummary';
import { NotificationsService } from '../../Services/notifications.service';

declare var CanvasJS: any;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: any;
  private canvasJSCheckInterval: any;
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
    coverage: 0,
  };
  topIncomeCategories: CategoryBreakdown[] = [];
  topExpenseCategories: CategoryBreakdown[] = [];
  balanceLabel = 'Egyensúly';
  balanceStatusClass = 'balance-neutral';
  private chartData: { income: any[]; expense: any[] } = {
    income: [],
    expense: [],
  };
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
    const categoriesRequest = this.apiService.getAll(
      `${this.baseUrl}/categories`
    );
    const transactionsRequest = this.apiService.getAll(
      `${this.baseUrl}/transactions`
    );

    Promise.all([categoriesRequest, transactionsRequest])
      .then(([categoriesResponse, transactionsResponse]) => {
        this.categories = Array.isArray(categoriesResponse?.data)
          ? categoriesResponse.data
          : [];
        this.transactions = Array.isArray(transactionsResponse?.data)
          ? transactionsResponse.data
          : [];
        this.loading = false;
        this.recalculateStatistics();
      })
      .catch((error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
        this.notifications.show(
          'error',
          'Hiba',
          'Nem sikerült betölteni a statisztikákat'
        );
        this.resetStatistics();
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (typeof CanvasJS !== 'undefined' && CanvasJS.Chart) {
        this.initChart();
      } else {
        this.canvasJSCheckInterval = setInterval(() => {
          if (typeof CanvasJS !== 'undefined' && CanvasJS.Chart) {
            clearInterval(this.canvasJSCheckInterval);
            this.initChart();
          }
        }, 100);

        setTimeout(() => {
          if (this.canvasJSCheckInterval) {
            clearInterval(this.canvasJSCheckInterval);
          }
        }, 5000);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.canvasJSCheckInterval) {
      clearInterval(this.canvasJSCheckInterval);
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private updateChartWithTransactions() {
    if (!this.chart) {
      if (typeof CanvasJS !== 'undefined' && CanvasJS.Chart) {
        this.initChart();
      }
      return;
    }

    if (
      this.chartData.income.length === 0 &&
      this.chartData.expense.length === 0
    ) {
      this.chart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'Bevételek',
          color: '#10b981',
          dataPoints: [],
        },
        {
          type: 'column',
          axisYType: 'secondary',
          showInLegend: true,
          name: 'Kiadások',
          color: '#ef4444',
          dataPoints: [],
        },
      ];
      this.chart.render();
      return;
    }

    const allCategories = new Set<string>();
    this.chartData.income.forEach((point: any) => {
      if (point.label) allCategories.add(point.label);
    });
    this.chartData.expense.forEach((point: any) => {
      if (point.label) allCategories.add(point.label);
    });

    const categoryArray = Array.from(allCategories);

    if (categoryArray.length === 0) {
      this.chart.options.data = [
        {
          type: 'column',
          showInLegend: true,
          name: 'Bevételek',
          color: '#10b981',
          dataPoints: this.chartData.income,
        },
        {
          type: 'column',
          axisYType: 'secondary',
          showInLegend: true,
          name: 'Kiadások',
          color: '#ef4444',
          dataPoints: this.chartData.expense,
        },
      ];
      this.chart.render();
      return;
    }

    const incomeMap = new Map(
      this.chartData.income.map((p: any) => [p.label, p.y])
    );
    const expenseMap = new Map(
      this.chartData.expense.map((p: any) => [p.label, p.y])
    );

    const incomePoints = categoryArray.map((label, index) => ({
      x: index,
      y: incomeMap.get(label) || 0,
      label: label,
    }));

    const expensePoints = categoryArray.map((label, index) => ({
      x: index,
      y: expenseMap.get(label) || 0,
      label: label,
    }));

    this.chart.options.data = [
      {
        type: 'column',
        showInLegend: true,
        name: 'Bevételek',
        color: '#10b981',
        dataPoints: incomePoints,
      },
      {
        type: 'column',
        axisYType: 'secondary',
        showInLegend: true,
        name: 'Kiadások',
        color: '#ef4444',
        dataPoints: expensePoints,
      },
    ];

    this.chart.render();
  }

  private getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
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
        label: this.getCategoryName(categoryId),
      }));

    const expensePoints = Array.from(expenseMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId, amount], index) => ({
        x: index,
        y: amount,
        label: this.getCategoryName(categoryId),
      }));

    return {
      incomePoints,
      expensePoints,
      incomeMap,
      expenseMap,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    };
  }

  private initChart() {
    const chartContainer = document.getElementById('chartContainer');
    if (!chartContainer) {
      console.error('Chart container not found');
      return;
    }

    if (typeof CanvasJS === 'undefined' || !CanvasJS.Chart) {
      console.error('CanvasJS is not loaded');
      return;
    }

    this.chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      zoomEnabled: true,
      theme: 'light2',
      backgroundColor: 'transparent',
      title: {
        text: 'Bevételek és Kiadások',
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: 'bold',
      },
      axisX: {
        title: 'Kategória',
        titleFontFamily: 'Montserrat',
        valueFormatString: '',
        interval: 1,
        labelAngle: -45,
        labelFontFamily: 'Montserrat',
      },
      axisY: {
        logarithmic: false,
        title: 'Összeg (HUF)',
        titleFontFamily: 'Montserrat',
        titleFontColor: '#6D78AD',
        lineColor: '#6D78AD',
        gridThickness: 1,
        gridColor: '#e5e7eb',
        lineThickness: 2,
        labelFontFamily: 'Montserrat',
        labelFormatter: (e: any) => {
          return this.formatCurrency(e.value);
        },
      },
      axisY2: {
        title: 'Összeg (HUF)',
        titleFontFamily: 'Montserrat',
        titleFontColor: '#ef4444',
        logarithmic: false,
        lineColor: '#ef4444',
        gridThickness: 0,
        lineThickness: 2,
        labelFontFamily: 'Montserrat',
        labelFormatter: (e: any) => {
          return this.formatCurrency(e.value);
        },
      },
      legend: {
        verticalAlign: 'top',
        horizontalAlign: 'right',
        fontSize: 14,
        fontFamily: 'Montserrat',
        cursor: 'pointer',
        itemclick: (e: any) => {
          e.dataSeries.visible = !(
            typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible
          );
          e.chart.render();
        },
      },
      toolTip: {
        shared: true,
        fontFamily: 'Montserrat',
        contentFormatter: (e: any) => {
          let content = '';
          if (e.entries && e.entries.length > 0) {
            content +=
              '<strong>' + e.entries[0].dataSeries.name + '</strong><br/>';
            e.entries.forEach((entry: any) => {
              content +=
                entry.dataSeries.name +
                ': ' +
                this.formatCurrency(entry.dataPoint.y) +
                '<br/>';
            });
          }
          return content;
        },
      },
      data: [
        {
          type: 'column',
          showInLegend: true,
          name: 'Bevételek',
          color: '#10b981',
          dataPoints: [],
        },
        {
          type: 'column',
          axisYType: 'secondary',
          showInLegend: true,
          name: 'Kiadások',
          color: '#ef4444',
          dataPoints: [],
        },
      ],
    });

    this.chart.render();

    if (this.transactions.length > 0) {
      setTimeout(() => {
        this.updateChartWithTransactions();
      }, 100);
    }
  }

  private formatCurrency(value: number): string {
    if (value === 0) return '0';
    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  private addSymbols(e: any): string {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const order = Math.max(
      Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)),
      0
    );
    const suffixOrder =
      order > suffixes.length - 1 ? suffixes.length - 1 : order;
    const suffix = suffixes[suffixOrder];
    return (
      CanvasJS.formatNumber(e.value / Math.pow(1000, order), '#,##0.##') +
      suffix
    );
  }

  private recalculateStatistics() {
    if (!this.transactions || this.transactions.length === 0) {
      this.resetStatistics();
      setTimeout(() => {
        this.updateChartWithTransactions();
      }, 200);
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
      expenseCount,
    } = this.processTransactionData();

    this.hasTransactions = true;
    this.summary.incomeTotal = incomeTotal;
    this.summary.expenseTotal = expenseTotal;
    this.summary.netBalance = incomeTotal - expenseTotal;
    this.summary.incomeCount = incomeCount;
    this.summary.expenseCount = expenseCount;
    this.summary.incomeAverage = incomeCount ? incomeTotal / incomeCount : 0;
    this.summary.expenseAverage = expenseCount
      ? expenseTotal / expenseCount
      : 0;
    this.summary.coverage =
      expenseTotal === 0 ? 100 : Math.round((incomeTotal / expenseTotal) * 100);

    this.topIncomeCategories = this.mapToBreakdown(incomeMap, incomeTotal);
    this.topExpenseCategories = this.mapToBreakdown(expenseMap, expenseTotal);

    this.balanceStatusClass = this.getBalanceStatusClass(
      this.summary.netBalance
    );
    this.balanceLabel = this.getBalanceLabel(this.summary.netBalance);

    this.chartData = {
      income: incomePoints,
      expense: expensePoints,
    };

    setTimeout(() => {
      this.updateChartWithTransactions();
    }, 200);
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
      coverage: 0,
    };
    this.topIncomeCategories = [];
    this.topExpenseCategories = [];
    this.balanceLabel = 'Nincs adat';
    this.balanceStatusClass = 'balance-neutral';
    this.chartData = { income: [], expense: [] };
  }

  private mapToBreakdown(
    map: Map<string, number>,
    total: number
  ): CategoryBreakdown[] {
    if (map.size === 0) {
      return [];
    }

    return Array.from(map.entries())
      .map(([categoryId, amount]) => ({
        name: this.getCategoryName(categoryId),
        amount,
        percentage: total === 0 ? 0 : Math.round((amount / total) * 100),
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

  get topIncomeCategoryName(): string {
    return this.topIncomeCategories.length > 0
      ? this.topIncomeCategories[0].name
      : 'Nincs adat';
  }

  get topExpenseCategoryName(): string {
    return this.topExpenseCategories.length > 0
      ? this.topExpenseCategories[0].name
      : 'Nincs adat';
  }
}
