import LatestBlocks from '~/components/latest-blocks';
import LatestTransactions from '~/components/latest-transactions';

const Home = () => {
  return (
    <main className="flex w-screen flex-col px-5 sm:px-10">
      <section className="mt-20 flex w-full flex-col items-start gap-4 lg:flex-row">
        <section className="w-full rounded-lg border border-border shadow-lg">
          <div className="border-b px-5 py-5">
            <p className="text-sm font-semibold">Latest blocks</p>
          </div>
          <LatestBlocks />
        </section>
        <section className="w-full rounded-lg border border-border shadow-lg">
          <div className="border-b px-5 py-5">
            <p className="text-sm font-semibold">Latest transactions</p>
          </div>
          <LatestTransactions />
        </section>
      </section>
    </main>
  );
};

export default Home;
