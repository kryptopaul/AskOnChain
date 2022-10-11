import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MantineProvider, Global } from '@mantine/core';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profile } from "./routes/Profile";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'



const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: 'qOMxCXzbW142c1SwUvqfzgxiBZBYrzCD' }),
  publicProvider(),
])

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor: '',
        }
      })}
    />
  );
}

root.render(
  <WagmiConfig client={client}>
  <MantineProvider withGlobalStyles withNormalizeCSS theme={{primaryColor: 'brand', colorScheme: 'dark', colors: {
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
  </WagmiConfig>
);

