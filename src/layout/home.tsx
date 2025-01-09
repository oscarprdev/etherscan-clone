import LatestBlocks from '~/components/latest-blocks';

const Home = () => {
  return (
    <main className="flex w-screen flex-col px-5 sm:px-10">
      <section className="mt-20 flex w-full flex-col items-start gap-4 lg:flex-row">
        <LatestBlocks />
        <LatestBlocks />
      </section>
    </main>
  );
};

export default Home;
