import { CountdownCircleTimer } from "react-countdown-circle-timer";

import styles from "../../styles/CountdownCircleTimer.module.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className={styles.timer}>اعادة</div>;
  }

  return (
    <div className={styles.timer}>
      <div className={styles.text}>جاي العد</div>
      <div className={styles.value}>{remainingTime}</div>
      <div className={styles.text}>ثواني</div>
    </div>
  );
};

function CountdownCircle(props) {
    
    const onComplete= ()=>{
        props.onComplete
        return [true,1000]
    }
  return (
    <div >
      <h1 className={styles.h1}>
        CountdownCircleTimer
        <br />
        React Component
      </h1>
      <div className={styles.timer_wrapper}>
        <CountdownCircleTimer
          isPlaying={props.isTr}
          duration={10}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={onComplete}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <p className="info">
        Change component properties in the code filed on the right to try
        difference functionalities
      </p>
    </div>
  );
}
export default CountdownCircle;