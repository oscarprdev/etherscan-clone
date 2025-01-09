import { useParams } from 'react-router';

const BlockDetail = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default BlockDetail;
