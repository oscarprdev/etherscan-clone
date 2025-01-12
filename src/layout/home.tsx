import EtherInfoCard from '~/components/ether-info-card';
import LatestBlocks from '~/components/latest-blocks';
import LatestTransactions from '~/components/latest-transactions';
import SearchForm from '~/components/search-form';

const Home = () => {
  return (
    <main className="flex w-screen flex-col">
      <section
        className="flex items-start bg-slate-800 px-5 pb-20 pt-14 sm:px-10"
        style={{ backgroundImage: "url('./src/assets/waves-light.svg')" }}>
        <div className="flex w-full flex-col items-start gap-2 sm:w-10/12 md:w-8/12 lg:w-7/12">
          <h2 className="text-xl font-semibold text-white">The Ethereum Blockchain Explorer</h2>
          <SearchForm />
        </div>
      </section>
      <EtherInfoCard />
      <section className="flex w-full flex-col items-start gap-4 px-5 sm:px-10 lg:flex-row">
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
