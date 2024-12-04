import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ShipmentTracker from '../Tranferencias/ShipmentTracker';

const HomePage = () => {
  const [activeUsers, setActiveUsers] = useState(42);
  const [pendingTasks, setPendingTasks] = useState(7);
  const [revenue, setRevenue] = useState(15000);
  const [projectProgress, setProjectProgress] = useState(65);
  const chartRef = useRef<HTMLDivElement>(null);

  const recentActivities = [
    {
      user: 'Alice',
      action: 'Completó el informe trimestral',
      time: 'Hace 2 horas',
    },
    {
      user: 'Bob',
      action: 'Actualizó el inventario',
      time: 'Hace 4 horas',
    },
    {
      user: 'Charlie',
      action: 'Creó una nueva tarea',
      time: 'Hace 1 día',
    },
  ];

  const projectData = [
    { name: 'Ene', progress: 30 },
    { name: 'Feb', progress: 45 },
    { name: 'Mar', progress: 60 },
    { name: 'Abr', progress: 75 },
    { name: 'May', progress: projectProgress },
  ];

  const refreshData = () => {
    setActiveUsers(Math.floor(Math.random() * 50) + 30);
    setPendingTasks(Math.floor(Math.random() * 10) + 5);
    setRevenue(Math.floor(Math.random() * 10000) + 10000);
    setProjectProgress(Math.floor(Math.random() * 30) + 60);
  };


  return (
    <div className='h-[84vh] bg-white opacity-95 rounded-xl'>
      <ShipmentTracker />
      <Box sx={{ backgroundColor: '#CCC', minHeight: '84vh', py: 2, borderRadius: '10px' }}>
      <Box sx={{ px: { xs: 2, md: 8 }, mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Bienvenido a tu ERP
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle1">Usuarios Activos</Typography>
                <Typography variant="h3" fontWeight="bold">
                  {activeUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#ff9800', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle1">Tareas Pendientes</Typography>
                <Typography variant="h3" fontWeight="bold">
                  {pendingTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle1">Ingresos del Mes</Typography>
                <Typography variant="h3" fontWeight="bold">
                  ${revenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#673ab7', color: '#fff' }}>
              <CardContent>
                <Typography variant="subtitle1">Progreso del Proyecto</Typography>
                <Typography variant="h3" fontWeight="bold">
                  {projectProgress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={projectProgress}
                  sx={{
                    mt: 2,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#fff',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ px: { xs: 2, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Actividad Reciente
              </Typography>
              <List disablePadding>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start" disableGutters>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold" color="primary">
                            {activity.user}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                            >
                              {activity.action}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              display="block"
                            >
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider variant="fullWidth" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 4 }} ref={chartRef}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Progreso del Proyecto
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#1976d2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={refreshData}
          size="large"
        >
          Actualizar Datos
        </Button>
      </Box>
    </Box>

    </div>
  );
};

export default HomePage;
