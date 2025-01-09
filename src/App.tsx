import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import TransactionsList from '~/components/blocks-list';
import { config } from '~/config';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <main>
          <TransactionsList />
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
