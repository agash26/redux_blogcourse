import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, reset, incrementByAmt } from './counterSlice'

const Counter = () => {
  const cnt = useSelector((state) => state.counter.count)
  const dispatch = useDispatch()

  const [incrementAmt, setIncrementAmt] = useState(0);
  const addValue = Number(incrementAmt) || 0;

  const resetAll = () => {
    setIncrementAmt(0);
    dispatch(reset());
  }
  return (
    <section>
      <p>{cnt}</p>
      <div>
        <button onClick={() => { dispatch(increment()) }}>+</button>
        <button onClick={() => { dispatch(decrement()) }}>-</button>
      </div>
      <input
        type='text'
        value={incrementAmt}
        onChange={(e) => setIncrementAmt(e.target.value)}
      />

      <div>
        <button onClick={()=> dispatch(incrementByAmt(addValue))}>Add Amount</button>
        <button onClick={resetAll}>Reset</button>
      </div>
    </section>
  )
}

export default Counter