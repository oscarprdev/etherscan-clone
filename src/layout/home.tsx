import { Suspense, lazy } from 'react';

const LatestBlocks = lazy(() => import('~/components/latest-blocks.tsx'));
const LatestTransactions = lazy(() => import('~/components/latest-transactions.tsx'));

const Home = () => {
  return (
    <main className="flex w-screen flex-col px-5 sm:px-10">
      <section className="mt-20 flex w-full flex-col items-start gap-4 lg:flex-row">
        <Suspense fallback={<p>Loading...</p>}>
          <LatestBlocks />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <LatestTransactions />
        </Suspense>
      </section>
    </main>
  );
};

export default Home;
