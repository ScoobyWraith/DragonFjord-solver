import styles from './styles.module.css';

import React, { useRef, useEffect } from 'react';
import CanvasDispatcher from '../../service/CanvasDispatcher'
import Solver from '../../service/Solver';


interface ICanvasProps {
    setIsLoaderVisible: React.Dispatch<React.SetStateAction<boolean>>
    dateForSolution: Date
}

const MIN_DELAY: number = 500;
const canvasDispatcher: CanvasDispatcher = new CanvasDispatcher();

const Canvas: React.FC<ICanvasProps> = ({ setIsLoaderVisible, dateForSolution }) => {
    const canvasRef: React.RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            const startTime: number = new Date().getTime();
            setIsLoaderVisible(true);
            await new Promise(resolve => setTimeout(resolve, 100));
            canvasDispatcher.render(canvasContainerRef.current, canvasRef.current, new Solver(dateForSolution));

            const restTime: number = new Date().getTime() - startTime;
            await new Promise(resolve => setTimeout(resolve, MIN_DELAY - restTime));
            setIsLoaderVisible(false);
        })();
    }, [dateForSolution]);


    return (
        <div className={styles.canvasContainer} ref={canvasContainerRef} >
            <canvas className={styles.canvas} ref={canvasRef} />
        </div>
    );
};

export default Canvas;
