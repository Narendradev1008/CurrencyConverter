import { useState } from "react";
import { InputBox } from "./components"
import useCurrencyInfo from './hooks/useCurrencyinfo';
function App() {

  const [amount,setAmount]=useState(0)
  const [from,setFrom] =useState('usd')
  const [to,setTo] = useState('inr')
  const [convertedAmount,setConvertedAmount]=useState(0)
  const currencyInfo=useCurrencyInfo(from)
  const options=Object.keys(currencyInfo)

  const swap=()=>{
    let temp=from;
    setFrom(to);
    setTo(temp);
    temp =amount;
    setAmount(convertedAmount);
    setConvertedAmount(temp);
  }

  const comvert= ()=>{
    setConvertedAmount(amount*currencyInfo[to])
  }
  return (
        <div
            className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url('https://imgs.search.brave.com/C5MyyHElA2OYrLN9__ZcBsd6tG9d7LUXCur0iMAEpI0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDcy/MjM4NzkzL3Bob3Rv/L2N1cnJlbmN5LWV4/Y2hhbmdlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1UaS01/Z1BNcU9kemJvdjdB/SzZPUWo1RmFVN0VY/ZHNNOTg4X3Aza2Ew/NFM4PQ')`,
            }}
        >
            <div className="w-full">
                <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                           
                        }}
                    >
                        <div className="w-full mb-1">
                            <InputBox
                                label="From"
                                
                            />
                        </div>
                        <div className="relative w-full h-0.5">
                            <button
                                type="button"
                                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                                
                            >
                                swap
                            </button>
                        </div>
                        <div className="w-full mt-1 mb-4">
                            <InputBox
                                label="To"
                                
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
                            Convert 
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App
