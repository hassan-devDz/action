import { useTimer } from 'use-timer';

const DecrementalTimer = () => {
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 11,
    timerType: 'DECREMENTAL',
    endTime:5,
  onTimeOver: () => {
    console.log('Time is over');
  },
  });

  return (
    <>
      <div>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
      <p>Elapsed time: {time}</p>
      {status === 'RUNNING' && <p>Running...</p>}
    </>
  );
};
export default DecrementalTimer