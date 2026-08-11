import { AnalyticsRepository } from './analytics.repository';

export class AnalyticsService {
  private analyticsRepository = new AnalyticsRepository();

  async getDashboardAnalytics() {
    return this.analyticsRepository.getDashboardMetrics();
  }

  async getRevenueAnalytics() {
    const dashboard = await this.analyticsRepository.getDashboardMetrics();
    const history = await this.analyticsRepository.getMonthlyRevenueHistory();
    return {
      ...dashboard.revenue,
      history
    };
  }

  async getSubscriptionAnalytics() {
    const dashboard = await this.analyticsRepository.getDashboardMetrics();
    return dashboard.subscriptions;
  }

  async getAIAnalytics() {
    const dashboard = await this.analyticsRepository.getDashboardMetrics();
    return dashboard.ai;
  }
}
