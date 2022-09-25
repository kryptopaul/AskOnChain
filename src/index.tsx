import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MantineProvider, Global } from '@mantine/core';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profile } from "./routes/Profile";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor: 'beige',
        }
      })}
    />
  );
}

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS theme={{primaryColor: 'brand',colorScheme: 'light', colors: {
    brand: ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82','#AD1374' ],
  }}}>
    <GlobalStyles />
    <BrowserRouter basename='/'>

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:address" element={<Profile/>} />
        </Routes>
    </BrowserRouter>
  </MantineProvider>
);

