'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const SamplePage = () => {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Cargue Total">
        <Typography>HOLA MUNDO</Typography>
      </DashboardCard>
      <DashboardCard title="Cargue Incremental">
        <Typography>HOLA MUNDO</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

