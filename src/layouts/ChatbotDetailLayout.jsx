
import { Outlet } from 'react-router-dom';

const ChatbotDetailLayout = () => {
  return (

    <main className="flex-1 p-6 lg:p-8 bg-neutral-900">

      <Outlet />
    </main>
  );
};

export default ChatbotDetailLayout;