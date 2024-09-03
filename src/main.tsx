// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

 import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { Provider } from 'react-redux';
   import { ApolloProvider } from '@apollo/client';
   import { store } from './store/store';
   import client from './apolloClient';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
       <React.StrictMode>
           <Provider store={store}>
               <ApolloProvider client={client}>
                   <App />
               </ApolloProvider>
           </Provider>
       </React.StrictMode>
   );


