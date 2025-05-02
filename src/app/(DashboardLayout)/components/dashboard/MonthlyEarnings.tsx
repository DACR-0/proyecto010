import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, Box } from '@mui/material';
import { IconArrowUpRight, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';

  const [chartData, setChartData] = useState<{ año: number; valor: number; ir: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/punto_s');
        const data = await response.json();
        console.log('API response:', data);
        if (Array.isArray(data)) {
          setChartData(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const optionscolumnchart: ApexCharts.ApexOptions = {
    chart: {
      type: 'area' as 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: '100%',
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    xaxis: {
      categories: Array.isArray(chartData) ? chartData.map(item => item.año) : [],
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: { colors: [secondarylight], type: 'solid', opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: theme.palette.mode === 'dark' ? 'dark' : 'light' },
  };

  const seriescolumnchart = [
    {
      name: 'Valor Anual',
      color: secondary,
      data: Array.isArray(chartData) ? chartData.map(item => item.valor) : [],
    },
  ];

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].valor : 0;
  const latestIr = chartData.length > 0 ? chartData[chartData.length - 1].ir : 0;
  const latestYear = chartData.length > 0 ? chartData[chartData.length - 1].año : '';

  return (
    <DashboardCard
      title="Punto Salarial Anual"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={220} width="100%" />
      }
      sx={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          ${latestValue.toLocaleString()}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: secondarylight, width: 27, height: 27 }}>
            <IconArrowUpRight width={20} color="#00bd3c" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            {latestIr}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Último año ({latestYear})
          </Typography>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default MonthlyEarnings;

