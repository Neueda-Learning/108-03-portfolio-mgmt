const portfolioDataByUser = {
  1: {
    summaryCards: [
      { title: 'Portfolio Value', value: '₹248,420', iconKey: 'value', change: '+6.8%', isPositive: true, iconBgColor: 'bg-sky-100' },
      { title: 'Total Gain', value: '₹18,945', iconKey: 'gain', change: '+3.1%', isPositive: true, iconBgColor: 'bg-emerald-100' },
      { title: 'Asset Classes', value: '5', iconKey: 'allocation', change: '-0.6%', isPositive: false, iconBgColor: 'bg-amber-100' },
      { title: 'Monthly Return', value: '₹4,260', iconKey: 'return', change: '+2.4%', isPositive: true, iconBgColor: 'bg-violet-100' },
    ],
    allocationData: [
      { name: 'Equity', value: 48 },
      { name: 'Debt', value: 22 },
      { name: 'Gold', value: 12 },
      { name: 'ETF', value: 10 },
      { name: 'Cash', value: 8 },
    ],
    performanceData: [
      { data: 'Jan', value: 198000, invested: 186500, allocation: { Equity: 45, Debt: 24, Gold: 13, ETF: 10, Cash: 8 } },
      { data: 'Feb', value: 205500, invested: 191000, allocation: { Equity: 46, Debt: 23, Gold: 13, ETF: 10, Cash: 8 } },
      { data: 'Mar', value: 210800, invested: 196000, allocation: { Equity: 47, Debt: 23, Gold: 12, ETF: 10, Cash: 8 } },
      { data: 'Apr', value: 221200, invested: 201500, allocation: { Equity: 47, Debt: 22, Gold: 12, ETF: 11, Cash: 8 } },
      { data: 'May', value: 228900, invested: 207000, allocation: { Equity: 48, Debt: 22, Gold: 12, ETF: 10, Cash: 8 } },
      { data: 'Jun', value: 236400, invested: 212500, allocation: { Equity: 48, Debt: 22, Gold: 12, ETF: 10, Cash: 8 } },
      { data: 'Jul', value: 248420, invested: 219200, allocation: { Equity: 48, Debt: 22, Gold: 12, ETF: 10, Cash: 8 } },
    ],
    holdingsData: [
      { asset: 'Apple Inc.', type: 'Equity', quantity: 42, buyPrice: 164.5, currentPrice: 192.3, marketValue: 8076.6, profitLoss: 1167.6 },
      { asset: 'NVIDIA', type: 'Equity', quantity: 18, buyPrice: 880.0, currentPrice: 915.4, marketValue: 16477.2, profitLoss: 637.2 },
      { asset: 'Gold ETF', type: 'Commodity', quantity: 65, buyPrice: 54.2, currentPrice: 51.9, marketValue: 3373.5, profitLoss: -149.5 },
      { asset: 'US Treasury Fund', type: 'Debt', quantity: 120, buyPrice: 26.8, currentPrice: 27.35, marketValue: 3282, profitLoss: 66 },
    ],
  },
  2: {
    summaryCards: [
      { title: 'Portfolio Value', value: '₹186,730', iconKey: 'value', change: '+4.2%', isPositive: true, iconBgColor: 'bg-sky-100' },
      { title: 'Total Gain', value: '₹11,280', iconKey: 'gain', change: '+1.8%', isPositive: true, iconBgColor: 'bg-emerald-100' },
      { title: 'Asset Classes', value: '4', iconKey: 'allocation', change: '0.0%', isPositive: true, iconBgColor: 'bg-amber-100' },
      { title: 'Monthly Return', value: '₹2,140', iconKey: 'return', change: '+1.2%', isPositive: true, iconBgColor: 'bg-violet-100' },
    ],
    allocationData: [
      { name: 'Equity', value: 42 },
      { name: 'Debt', value: 30 },
      { name: 'Gold', value: 14 },
      { name: 'ETF', value: 8 },
      { name: 'Cash', value: 6 },
    ],
    performanceData: [
      { data: 'Jan', value: 161800, invested: 155000, allocation: { Equity: 40, Debt: 31, Gold: 15, ETF: 8, Cash: 6 } },
      { data: 'Feb', value: 165400, invested: 157500, allocation: { Equity: 41, Debt: 31, Gold: 14, ETF: 8, Cash: 6 } },
      { data: 'Mar', value: 169900, invested: 160200, allocation: { Equity: 41, Debt: 30, Gold: 14, ETF: 9, Cash: 6 } },
      { data: 'Apr', value: 173200, invested: 163000, allocation: { Equity: 42, Debt: 30, Gold: 14, ETF: 8, Cash: 6 } },
      { data: 'May', value: 177100, invested: 166000, allocation: { Equity: 42, Debt: 30, Gold: 14, ETF: 8, Cash: 6 } },
      { data: 'Jun', value: 181500, invested: 168700, allocation: { Equity: 42, Debt: 30, Gold: 14, ETF: 8, Cash: 6 } },
      { data: 'Jul', value: 186730, invested: 171300, allocation: { Equity: 42, Debt: 30, Gold: 14, ETF: 8, Cash: 6 } },
    ],
    holdingsData: [
      { asset: 'Microsoft', type: 'Equity', quantity: 25, buyPrice: 375.2, currentPrice: 401.7, marketValue: 10042.5, profitLoss: 662.5 },
      { asset: 'Vanguard Bond ETF', type: 'Debt', quantity: 90, buyPrice: 79.1, currentPrice: 80.4, marketValue: 7236, profitLoss: 117 },
      { asset: 'Gold Mini', type: 'Commodity', quantity: 110, buyPrice: 43.4, currentPrice: 44.0, marketValue: 4840, profitLoss: 66 },
      { asset: 'NASDAQ ETF', type: 'ETF', quantity: 35, buyPrice: 122.3, currentPrice: 129.6, marketValue: 4536, profitLoss: 255.5 },
    ],
  },
  3: {
    summaryCards: [
      { title: 'Portfolio Value', value: '₹312,580', iconKey: 'value', change: '+8.9%', isPositive: true, iconBgColor: 'bg-sky-100' },
      { title: 'Total Gain', value: '₹29,940', iconKey: 'gain', change: '+4.4%', isPositive: true, iconBgColor: 'bg-emerald-100' },
      { title: 'Asset Classes', value: '5', iconKey: 'allocation', change: '+0.4%', isPositive: true, iconBgColor: 'bg-amber-100' },
      { title: 'Monthly Return', value: '₹5,980', iconKey: 'return', change: '+3.6%', isPositive: true, iconBgColor: 'bg-violet-100' },
    ],
    allocationData: [
      { name: 'Equity', value: 56 },
      { name: 'Debt', value: 17 },
      { name: 'Gold', value: 9 },
      { name: 'ETF', value: 13 },
      { name: 'Cash', value: 5 },
    ],
    performanceData: [
      { data: 'Jan', value: 246000, invested: 228500, allocation: { Equity: 54, Debt: 18, Gold: 10, ETF: 13, Cash: 5 } },
      { data: 'Feb', value: 255400, invested: 232800, allocation: { Equity: 54, Debt: 18, Gold: 10, ETF: 13, Cash: 5 } },
      { data: 'Mar', value: 266300, invested: 237500, allocation: { Equity: 55, Debt: 18, Gold: 9, ETF: 13, Cash: 5 } },
      { data: 'Apr', value: 276800, invested: 242200, allocation: { Equity: 55, Debt: 17, Gold: 10, ETF: 13, Cash: 5 } },
      { data: 'May', value: 288100, invested: 246900, allocation: { Equity: 56, Debt: 17, Gold: 9, ETF: 13, Cash: 5 } },
      { data: 'Jun', value: 300600, invested: 251800, allocation: { Equity: 56, Debt: 17, Gold: 9, ETF: 13, Cash: 5 } },
      { data: 'Jul', value: 312580, invested: 257100, allocation: { Equity: 56, Debt: 17, Gold: 9, ETF: 13, Cash: 5 } },
    ],
    holdingsData: [
      { asset: 'Tesla', type: 'Equity', quantity: 30, buyPrice: 212.2, currentPrice: 248.9, marketValue: 7467, profitLoss: 1101 },
      { asset: 'S&P 500 ETF', type: 'ETF', quantity: 80, buyPrice: 472.4, currentPrice: 503.0, marketValue: 40240, profitLoss: 2448 },
      { asset: 'Corporate Bond Fund', type: 'Debt', quantity: 140, buyPrice: 24.2, currentPrice: 25.1, marketValue: 3514, profitLoss: 126 },
      { asset: 'Physical Gold Trust', type: 'Commodity', quantity: 50, buyPrice: 181.5, currentPrice: 189.0, marketValue: 9450, profitLoss: 375 },
    ],
  },
}

export const getPortfolioDataForUser = (userId) => {
  return portfolioDataByUser[userId] ?? portfolioDataByUser[1]
}

// Backward-compatible exports for existing imports.
export const allocationData = portfolioDataByUser[1].allocationData
export const performanceData = portfolioDataByUser[1].performanceData
