// import React, { useState } from 'react';
// import { 
//   Box, 
//   Container, 
//   Typography, 
//   Grid, 
//   Paper, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   Button, 
//   LinearProgress,
//   useTheme
// } from '@mui/material';
// import { 
//   LineChart, 
//   Line, 
//   CartesianGrid, 
//   XAxis, 
//   YAxis, 
//   Tooltip, 
//   ResponsiveContainer 
// } from 'recharts';

// const HomePage: React.FC = () => {
//   const theme = useTheme();
//   const [activeUsers, setActiveUsers] = useState(42);
//   const [pendingTasks, setPendingTasks] = useState(7);
//   const [revenue, setRevenue] = useState(15000);
//   const [projectProgress, setProjectProgress] = useState(65);

//   const recentActivities = [
//     { user: "Alice", action: "Completó el informe trimestral", time: "Hace 2 horas" },
//     { user: "Bob", action: "Actualizó el inventario", time: "Hace 4 horas" },
//     { user: "Charlie", action: "Creó una nueva tarea", time: "Hace 1 día" },
//   ];

//   const projectData = [
//     { name: 'Ene', progress: 30 },
//     { name: 'Feb', progress: 45 },
//     { name: 'Mar', progress: 60 },
//     { name: 'Abr', progress: 75 },
//     { name: 'May', progress: projectProgress },
//   ];

//   const refreshData = () => {
//     setActiveUsers(Math.floor(Math.random() * 50) + 30);
//     setPendingTasks(Math.floor(Math.random() * 10) + 5);
//     setRevenue(Math.floor(Math.random() * 10000) + 10000);
//     setProjectProgress(Math.floor(Math.random() * 30) + 60);
//   };

//   return (
//     <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
//       <Container maxWidth="lg">
//         <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
//           Bienvenido a tu ERP
//         </Typography>
        
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {[
//             { title: 'Usuarios Activos', value: activeUsers, color: theme.palette.primary.main },
//             { title: 'Tareas Pendientes', value: pendingTasks, color: theme.palette.warning.main },
//             { title: 'Ingresos del Mes', value: `${revenue.toLocaleString()}`, color: theme.palette.success.main },
//             { title: 'Progreso del Proyecto', value: `${projectProgress}%`, color: theme.palette.info.main },
//           ].map((item, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//                 <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>{item.title}</Typography>
//                 <Typography variant="h4" sx={{ fontWeight: 'bold', color: item.color }}>{item.value}</Typography>
//                 {index === 3 && <LinearProgress variant="determinate" value={projectProgress} sx={{ mt: 2 }} />}
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
        
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
//               <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
//                 Actividad Reciente
//               </Typography>
//               <List>
//                 {recentActivities.map((activity, index) => (
//                   <ListItem key={index} sx={{ px: 0, borderBottom: index !== recentActivities.length - 1 ? 1 : 0, borderColor: 'divider' }}>
//                     <ListItemText
//                       primary={<Typography variant="subtitle1" sx={{ color: theme.palette.primary.main }}>{activity.user}</Typography>}
//                       secondary={
//                         <>
//                           <Typography variant="body2" sx={{ color: 'text.primary' }}>{activity.action}</Typography>
//                           <Typography variant="caption" sx={{ color: 'text.secondary' }}>{activity.time}</Typography>
//                         </>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
//               <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: 'text.primary' }}>
//                 Progreso del Proyecto
//               </Typography>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={projectData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="progress" stroke={theme.palette.primary.main} strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Grid>
//         </Grid>
        
//         <Box sx={{ mt: 4, textAlign: 'center' }}>
//           <Button variant="contained" color="primary" onClick={refreshData} sx={{ px: 4, py: 1 }}>
//             Actualizar Datos
//           </Button>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default HomePage;


import React, { useState } from 'react';
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
} from 'recharts';

const HomePage = () => {
  const [activeUsers, setActiveUsers] = useState(42);
  const [pendingTasks, setPendingTasks] = useState(7);
  const [revenue, setRevenue] = useState(15000);
  const [projectProgress, setProjectProgress] = useState(65);

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
    <div className='h-[84vh] '>
      <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '84vh', py: 2 }}>
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
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="textSecondary"
                gutterBottom
              >
                Progreso del Proyecto
              </Typography>
              <LineChart width={500} height={280} data={projectData}>
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