import styles from './styles.module.css';

import React from 'react';


interface ILoaderProps {
    isVisible: boolean
}

const Loader: React.FC<ILoaderProps> = ({ isVisible }) => {
    const style: React.CSSProperties = isVisible ? {} : {display: "none"};
    
    return (
        <div className={styles.loaderOverlay} style={style}>
            <div className={styles.loader}></div>
        </div>
    );
};

export default Loader;