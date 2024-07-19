import React, { useState, useEffect } from 'react'
import axios from 'axios';
import logo from './Assets/Pokemon-Logo.png'

function PokemonComponent() {

    const [PrevPokemon, setPrevPokemon] = useState(null);
    const [NewPokemon, setNewPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [isShowingWeight, setShowWeight] = useState(false);
 
    //get random number that will be placed inside the api link
    const randomNumGenerator = () => {
        return Math.floor(Math.random() * 1026);
    }


    const handleFetchPokemon = () => {
        
        //first fetch where you are just starting the game
        if(PrevPokemon == null) {
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
            })
        } else {
            

            const response1 = axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumGenerator()}`)
            .then((response1) => {
                setNewPokemon(response1.data);
                console.log(response1);
                setPrevPokemon(NewPokemon);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    const handlePokemonWeightChecker = (prevPokemon, newPokemon, userInput) => {
        console.log(prevPokemon);
        console.log(newPokemon);

        if(prevPokemon < newPokemon && userInput == 'Lighter') {
            console.log("correct")
            setScore(score + 1);
            handleFetchPokemon();
        } else if(prevPokemon > newPokemon && userInput == 'Heavier'){
            console.log("correct");
            setScore(score + 1);
            handleFetchPokemon();
        } else {
            console.log("incorrect");
        }
    }

    return (
        <div className='flex z-50 items-center justify-evenly h-[100vh] text-lg'>

            {!loading ? (
                <div className='flex flex-col'>
                    <div className='flex'>
                        <div className='flex flex-col items-center'>
                            <img src={PrevPokemon.sprites?.other?.['official-artwork']?.front_default} alt={PrevPokemon.name} />
                            <h1 className='text-white text-3xl capitalize font-bold'>{PrevPokemon.name}</h1>
                        </div>

                        <div className='text-white flex flex-col items-center'>
                            <h2><span className='capitalize'>{PrevPokemon.name}</span> is</h2>
                            <div className='flex flex-col'>
                                <button onClick={(e) => handlePokemonWeightChecker(PrevPokemon.weight, NewPokemon.weight, e.target.innerText)} className='px-[2rem] py-2 rounded-xl border-white border-2 my-5'>Lighter</button>
                                <button onClick={(e) => handlePokemonWeightChecker(PrevPokemon.weight, NewPokemon.weight, e.target.innerText)} className='px-[2rem] py-2 rounded-xl border-white border-2 my-5'>Heavier</button>
                            </div>
                            <h2>than <span className='capitalize'>{NewPokemon.name}</span></h2>
                        </div>

                        <div className='flex flex-col items-center'>
                            <img src={NewPokemon.sprites?.other?.['official-artwork']?.front_default} alt={PrevPokemon.name} />
                            <h1 className='text-white text-3xl capitalize font-bold'>{NewPokemon.name}</h1>
                        </div>
                    </div>
                    <h1 className='text-white'>Score: {score}</h1>
                </div>) 
                : 
                <div className='flex items-center justify-center h-[100vh] flex-col'>
                <img className='w-[30rem] h-[auto]' src={logo}></img>
                <h1 className='text-white text-[4rem] font-bold -mt-9'>Lighter or Heavier!</h1>
                <button onClick={handleFetchPokemon} className='px-4 bg-green-400 py-3 rounded-md mt-5'>Start Game</button>
            </div>
            }




        </div>
    )
}

export default PokemonComponent