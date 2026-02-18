import styles from './styles.module.css';

import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

import Canvas from './components/Canvas';
import Calendar from './components/Calendar';
import Loader from './components/Loader';


const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}
  
const App: React.FC = () => {
    const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(false);
    const [dateForSolution, setDateForSolution] = useState<Date>(new Date());

    return (
        <div className={styles.root} >
            <Calendar setDateForSolution={setDateForSolution} setIsLoaderVisible={setIsLoaderVisible} initDate={dateForSolution}/>
            <Canvas setIsLoaderVisible={setIsLoaderVisible} dateForSolution={dateForSolution} />
            <Loader isVisible={isLoaderVisible} />
        </div>
    );
};

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);