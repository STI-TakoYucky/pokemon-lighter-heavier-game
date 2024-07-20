import React, { useState, useEffect } from 'react'
import axios from 'axios';
import logo from './Assets/Pokemon-Logo.png'

function PokemonComponent() {

    const [PrevPokemon, setPrevPokemon] = useState(null);
    const [NewPokemon, setNewPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPreloaderLoading, setPreloaderLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [isShowingWeight, setShowWeight] = useState(false);
    const [isIncorrect, setIncorrect] = useState(false);
    const [highscore, setHighScore] = useState(0);
    const [isDisabledButtons, setDisableButtons] = useState(false);
 
    //get random number that will be placed inside the api link
    const randomNumGenerator = () => {
        return Math.floor(Math.random() * 1026);
    }

    const resetGame = () => {
        setPrevPokemon(null);
        setNewPokemon(null);
        setLoading(true);
        setPreloaderLoading(false);
        setShowWeight(false);
        setIncorrect(false)
        setDisableButtons(false)
        setScore(0);
        localStorage.setItem("highscore", highscore);
    }


    const handleFetchPokemon = () => {
        setShowWeight(false);
        //first fetch where you are just starting the game
        if(PrevPokemon == null) {
            setPreloaderLoading(true);
        const response1 = axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumGenerator()}`)
            .then((response1) => {
                setPrevPokemon(response1.data);
                console.log(response1);
            })
            .catch((error) => {
                console.log(error);
            });

        const response2 = axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumGenerator()}`)
            .then((response2) => {
                setNewPokemon(response2.data);
                console.log(response2);
            })
            .catch((error) => {
                console.log(error);
            });
           

                Promise.all([response1, response2])
            .then(() => {
                
                setLoading(false);
                setDisableButtons(false)
            })
        } else {
            

            const response1 = axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumGenerator()}`)
            .then((response1) => {
                setNewPokemon(response1.data);
                console.log(response1);
                setPrevPokemon(NewPokemon);
                setDisableButtons(false)
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    useEffect(() => {
        const storedHighScore = JSON.parse(localStorage.getItem("highscore"));
        if(storedHighScore) {
            setHighScore(storedHighScore);
        } else {
            setHighScore(0);
        }
    }, [])

    useEffect(() => {
        
            
        setPreloaderLoading(false)
        
    }, [NewPokemon]);

    //check if score is bigger than highscore
   useEffect(() => {
    if (score > highscore) {
        setHighScore(score);
        localStorage.setItem("highscore", highscore);
    }
   }, [score])

    const handlePokemonWeightChecker = (prevPokemon, newPokemon, userInput) => {
        console.log(prevPokemon);
        console.log(newPokemon);

        if(prevPokemon < newPokemon && userInput == 'Lighter') {
            console.log("correct")
            setScore(score + 1);
            setDisableButtons(true);
            setShowWeight(true);


        } else if(prevPokemon > newPokemon && userInput == 'Heavier'){
            console.log("correct");
            setScore(score + 1);
            setShowWeight(true);
            setDisableButtons(true);
        } else {
            console.log("incorrect");
            setIncorrect(true);
            setDisableButtons(true);
        }
    }

    return (
        <div className='flex z-50 items-center justify-evenly h-[100vh] text-lg'>

            { isPreloaderLoading &&
                <div className='Preloader fixed bg-black h-[100vh] w-[100vw] flex items-center justify-center'>
                <h1 className='text-white'>Loading Game</h1>
                </div>
            }
            
            
            {!loading ? (
                <div className='flex flex-col w-[100%] px-10'>
                    <div className='flex-col flex sm:flex-row justify-evenly'>
                        <div className='flex flex-col items-center'>
                        {isShowingWeight && <h1 className='text-white text-2xl font-bold'><span className='capitalize'>{PrevPokemon.name}</span> weighs {(PrevPokemon.weight) / 10} kg</h1>}
                            <img src={PrevPokemon.sprites?.other?.['official-artwork']?.front_default} alt={PrevPokemon.name} className='w-[10rem] p-5 h-auto sm:w-[32rem]'/>
                            <h1 className='text-white text-3xl capitalize font-bold'>{PrevPokemon.name}</h1>
                        </div>

                        <div className='text-white flex flex-col items-center justify-center p-5'>
                            {!isDisabledButtons ? 
                            <>
                            <h2><span className='capitalize'>{PrevPokemon.name}</span> is</h2>
                            <div className='flex flex-col'>
                                <button onClick={(e) => handlePokemonWeightChecker(PrevPokemon.weight, NewPokemon.weight, e.target.innerText)} className='px-[2rem] py-2 rounded-xl border-white border-2 my-5'>Lighter</button>
                                <button onClick={(e) => handlePokemonWeightChecker(PrevPokemon.weight, NewPokemon.weight, e.target.innerText)} className='px-[2rem] py-2 rounded-xl border-white border-2 my-5'>Heavier</button>
                            </div>
                            <h2>than <span className='capitalize'>{NewPokemon.name}</span></h2> 
                            </>
                            :
                            <>
                            {(isShowingWeight && !isIncorrect) && <button onClick={handleFetchPokemon} className='text-black px-4 bg-green-400 py-3 rounded-md mt-10'>Continue</button>}
                            {isIncorrect && <button onClick={resetGame} className='text-black px-4 bg-red-400 py-3 rounded-md mt-10'>Try Again!</button>}
                            </>
                        }
                           
                           
                        </div>


                        <div className='flex flex-col items-center'>
                        {isShowingWeight && <h1 className='text-white text-2xl font-bold'><span className='capitalize'>{NewPokemon.name}</span> weighs {(NewPokemon.weight) / 10} kg</h1>}
                            <img src={NewPokemon.sprites?.other?.['official-artwork']?.front_default} alt={NewPokemon.name} className='w-[10rem] p-5 h-auto sm:w-[32rem]'/>
                            <h1 className='text-white text-3xl capitalize font-bold'>{NewPokemon.name}</h1>
                        </div>
                    </div>
                    <h1 className='text-white mt-4'>Score: {score}</h1>
                </div>) 
                : 
                <div className='flex items-center justify-center h-[100vh] flex-col'>
                <img className='w-[30rem] h-[auto]' src={logo}></img>
                <h1 className='text-white text-5xl sm:text-[4rem] font-bold '>Lighter or Heavier!</h1>
                <button onClick={handleFetchPokemon} className='px-4 bg-green-400 py-3 rounded-md my-10'>Start Game</button>
                <p className='text-white '>Your highscore is: {highscore}</p>
            </div>
            }

        </div>
    )
}

export default PokemonComponent