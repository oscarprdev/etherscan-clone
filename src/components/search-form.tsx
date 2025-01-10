import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { isAddress } from 'viem';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const FILTERS = {
  BLOCKS: 'Blocks',
  ADDRESSES: 'Addresses',
  TRANSACTIONS: 'Transactions',
};

const SearchForm = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setError(null);
    }

    setSearchValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchValue) {
      return setError('Invalid search value');
    }

    const startsWith0x = searchValue.startsWith('0x');
    const isBlock = filter === FILTERS.BLOCKS || (!startsWith0x && searchValue.length === 8);
    const isValueAddress = filter === FILTERS.ADDRESSES || (!isBlock && isAddress(searchValue));
    const isTxs = filter === FILTERS.TRANSACTIONS || (startsWith0x && !isValueAddress);

    if (isBlock) {
      navigate(`/block/${searchValue}`);
    } else if (isValueAddress) {
      navigate(`/address/${searchValue}`);
    } else if (isTxs) {
      navigate(`/txs?hash=${searchValue}`);
    } else {
      setError('Please confirm the value is a valid address/transaction or block hash');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-lg bg-white p-1 shadow-md">
        <Select>
          <SelectTrigger className="hidden w-[180px] sm:flex">
            <SelectValue placeholder="All Filters" onChange={handleFilterChange} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FILTERS.BLOCKS}>{FILTERS.BLOCKS}</SelectItem>
            <SelectItem value={FILTERS.ADDRESSES}>{FILTERS.ADDRESSES}</SelectItem>
            <SelectItem value={FILTERS.TRANSACTIONS}>{FILTERS.TRANSACTIONS}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by Address / Txn hash / Block"
          className="focus-visible:ring-none w-full border-none"
          required
          onChange={handleSearchChange}
        />
        <Button size={'icon'} className="hover:bg-accent-hover w-12 bg-accent duration-200">
          <Search />
        </Button>
      </form>
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};

export default SearchForm;
