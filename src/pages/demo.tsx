import { NextPage } from 'next';
import { KudosCard } from '@/components/KudosCard';

const DemoPage: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kudos Demo</h1>
      <div className="max-w-md">
        <KudosCard 
          title="GREAT JOB!"
          message="This new concept and prototype scored really great in our usertests and the client loves it"
          emoji="💪"
        />
      </div>
    </div>
  );
};

export default DemoPage;