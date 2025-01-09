import BlockDetail from './layout/block-detail';
import Home from './layout/home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import { WagmiProvider } from 'wagmi';
import { config } from '~/config';
import '~/index.css';

const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="block">
              <Route path=":id" element={<BlockDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
