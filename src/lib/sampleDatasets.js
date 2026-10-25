/**
 * Curated real-world sample datasets for instant exploration in EdgeChart.
 */

export const SAMPLE_DATASETS = [
  {
    id: 'tech_companies',
    title: 'Global Tech Leaders',
    subtitle: 'Valuations, revenues & employee counts',
    category: 'Finance & Business',
    badge: '10 Rows · 7 Cols',
    data: [
      { Company: 'Apple', Sector: 'Consumer Electronics', Revenue_B: 383.2, MarketCap_B: 2850, Employees: 161000, Margin_Pct: 25.3, Founded: 1976 },
      { Company: 'Microsoft', Sector: 'Software & Cloud', Revenue_B: 211.9, MarketCap_B: 2790, Employees: 221000, Margin_Pct: 34.1, Founded: 1975 },
      { Company: 'Alphabet', Sector: 'Internet & Search', Revenue_B: 282.8, MarketCap_B: 1780, Employees: 182000, Margin_Pct: 21.2, Founded: 1998 },
      { Company: 'Amazon', Sector: 'E-Commerce & Cloud', Revenue_B: 514.0, MarketCap_B: 1510, Employees: 1540000, Margin_Pct: 2.4, Founded: 1994 },
      { Company: 'NVIDIA', Sector: 'Semiconductors', Revenue_B: 60.9, MarketCap_B: 1980, Employees: 29600, Margin_Pct: 48.8, Founded: 1993 },
      { Company: 'Meta', Sector: 'Social Media', Revenue_B: 116.6, MarketCap_B: 1240, Employees: 67300, Margin_Pct: 29.0, Founded: 2004 },
      { Company: 'Tesla', Sector: 'Automotive & Energy', Revenue_B: 96.8, MarketCap_B: 560, Employees: 140000, Margin_Pct: 15.5, Founded: 2003 },
      { Company: 'TSMC', Sector: 'Semiconductors', Revenue_B: 75.8, MarketCap_B: 640, Employees: 73000, Margin_Pct: 42.6, Founded: 1987 },
      { Company: 'Broadcom', Sector: 'Semiconductors', Revenue_B: 35.8, MarketCap_B: 580, Employees: 20000, Margin_Pct: 39.3, Founded: 1961 },
      { Company: 'Oracle', Sector: 'Enterprise Software', Revenue_B: 49.9, MarketCap_B: 320, Employees: 164000, Margin_Pct: 17.0, Founded: 1977 }
    ]
  },
  {
    id: 'iris_dataset',
    title: "Fisher's Iris Flower",
    subtitle: 'Classic multivariate statistical benchmark',
    category: 'Science & Biology',
    badge: '15 Rows · 5 Cols',
    data: [
      { SepalLength: 5.1, SepalWidth: 3.5, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.9, SepalWidth: 3.0, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.7, SepalWidth: 3.2, PetalLength: 1.3, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 4.6, SepalWidth: 3.1, PetalLength: 1.5, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 5.0, SepalWidth: 3.6, PetalLength: 1.4, PetalWidth: 0.2, Species: 'setosa' },
      { SepalLength: 7.0, SepalWidth: 3.2, PetalLength: 4.7, PetalWidth: 1.4, Species: 'versicolor' },
      { SepalLength: 6.4, SepalWidth: 3.2, PetalLength: 4.5, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 6.9, SepalWidth: 3.1, PetalLength: 4.9, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 5.5, SepalWidth: 2.3, PetalLength: 4.0, PetalWidth: 1.3, Species: 'versicolor' },
      { SepalLength: 6.5, SepalWidth: 2.8, PetalLength: 4.6, PetalWidth: 1.5, Species: 'versicolor' },
      { SepalLength: 6.3, SepalWidth: 3.3, PetalLength: 6.0, PetalWidth: 2.5, Species: 'virginica' },
      { SepalLength: 5.8, SepalWidth: 2.7, PetalLength: 5.1, PetalWidth: 1.9, Species: 'virginica' },
      { SepalLength: 7.1, SepalWidth: 3.0, PetalLength: 5.9, PetalWidth: 2.1, Species: 'virginica' },
      { SepalLength: 6.3, SepalWidth: 2.9, PetalLength: 5.6, PetalWidth: 1.8, Species: 'virginica' },
      { SepalLength: 6.5, SepalWidth: 3.0, PetalLength: 5.8, PetalWidth: 2.2, Species: 'virginica' }
    ]
  },
  {
    id: 'retail_sales',
    title: 'Retail Performance & Profit',
    subtitle: 'Quarterly sales across regions and products',
    category: 'E-Commerce',
    badge: '12 Rows · 7 Cols',
    data: [
      { Region: 'North America', Category: 'Laptops & PCs', Units: 1420, Price: 899, Revenue: 1276580, Cost: 840000, Profit: 436580 },
      { Region: 'North America', Category: 'Smartphones', Units: 2850, Price: 699, Revenue: 1992150, Cost: 1210000, Profit: 782150 },
      { Region: 'North America', Category: 'Audio Gear', Units: 3100, Price: 149, Revenue: 461900, Cost: 240000, Profit: 221900 },
      { Region: 'Europe', Category: 'Laptops & PCs', Units: 1180, Price: 849, Revenue: 1001820, Cost: 690000, Profit: 311820 },
      { Region: 'Europe', Category: 'Smartphones', Units: 2400, Price: 649, Revenue: 1557600, Cost: 990000, Profit: 567600 },
      { Region: 'Europe', Category: 'Audio Gear', Units: 2900, Price: 139, Revenue: 403100, Cost: 215000, Profit: 188100 },
      { Region: 'Asia Pacific', Category: 'Laptops & PCs', Units: 1890, Price: 799, Revenue: 1510110, Cost: 1020000, Profit: 490110 },
      { Region: 'Asia Pacific', Category: 'Smartphones', Units: 4200, Price: 599, Revenue: 2515800, Cost: 1650000, Profit: 865800 },
      { Region: 'Asia Pacific', Category: 'Audio Gear', Units: 4600, Price: 129, Revenue: 593400, Cost: 310000, Profit: 283400 },
      { Region: 'Latin America', Category: 'Laptops & PCs', Units: 650, Price: 780, Revenue: 507000, Cost: 360000, Profit: 147000 },
      { Region: 'Latin America', Category: 'Smartphones', Units: 1350, Price: 549, Revenue: 741150, Cost: 510000, Profit: 231150 },
      { Region: 'Latin America', Category: 'Audio Gear', Units: 1800, Price: 119, Revenue: 214200, Cost: 125000, Profit: 89200 }
    ]
  },
  {
    id: 'global_climate',
    title: 'Country Development & Energy',
    subtitle: 'GDP per capita, life expectancy & renewable share',
    category: 'Global Metrics',
    badge: '10 Rows · 6 Cols',
    data: [
      { Country: 'Norway', Continent: 'Europe', GDP_PerCapita: 89200, LifeExpectancy: 83.2, Renewable_Pct: 98.4, CO2_PerCapita: 7.1 },
      { Country: 'Iceland', Continent: 'Europe', GDP_PerCapita: 69400, LifeExpectancy: 83.1, Renewable_Pct: 99.7, CO2_PerCapita: 8.9 },
      { Country: 'Switzerland', Continent: 'Europe', GDP_PerCapita: 92100, LifeExpectancy: 84.0, Renewable_Pct: 76.5, CO2_PerCapita: 4.1 },
      { Country: 'Canada', Continent: 'Americas', GDP_PerCapita: 52400, LifeExpectancy: 82.6, Renewable_Pct: 67.8, CO2_PerCapita: 15.2 },
      { Country: 'Germany', Continent: 'Europe', GDP_PerCapita: 48500, LifeExpectancy: 81.3, Renewable_Pct: 52.3, CO2_PerCapita: 8.2 },
      { Country: 'Japan', Continent: 'Asia', GDP_PerCapita: 39300, LifeExpectancy: 84.6, Renewable_Pct: 22.4, CO2_PerCapita: 8.5 },
      { Country: 'Brazil', Continent: 'Americas', GDP_PerCapita: 8900, LifeExpectancy: 76.0, Renewable_Pct: 83.1, CO2_PerCapita: 2.1 },
      { Country: 'United States', Continent: 'Americas', GDP_PerCapita: 76300, LifeExpectancy: 77.3, Renewable_Pct: 23.5, CO2_PerCapita: 14.9 },
      { Country: 'Costa Rica', Continent: 'Americas', GDP_PerCapita: 12500, LifeExpectancy: 80.8, Renewable_Pct: 99.2, CO2_PerCapita: 1.6 },
      { Country: 'Australia', Continent: 'Oceania', GDP_PerCapita: 64500, LifeExpectancy: 83.3, Renewable_Pct: 35.8, CO2_PerCapita: 15.1 }
    ]
  }
];
