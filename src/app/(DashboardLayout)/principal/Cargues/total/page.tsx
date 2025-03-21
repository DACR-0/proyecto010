'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Image from "next/image";

const CargueTPage = () => {
  return (
    <PageContainer title="">
      <DashboardCard title="Sample Page">
        <Typography>HOLA MUNDO</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default CargueTPage;
