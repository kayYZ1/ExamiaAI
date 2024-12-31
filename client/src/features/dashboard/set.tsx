import { useParams } from 'react-router';

export default function Set() {
  const { setId } = useParams();
  console.log(setId);

  return (
    <div>
      <h1>Set</h1>
    </div>
  );
}
