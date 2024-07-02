import { useEffect, useState } from "react";
 import axios from 'axios';
 import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

 
 function PokemonList(){
    // const [pokemonlist,setPokemonlsit]=useState({});
    // const [isloading,setIsLoading]=useState(true);
    //  // download data from the web browser
    //  const [pokedex_url ,setpokedex_url]=useState('https://pokeapi.co/api/v2/pokemon');

    //  const[nexturl,setnexturl]=useState('');
    //  const[prevurl, setprevurl]=useState('');

     // using multiple state is not good programming practice for save option .

     // Bindig all the usestate into the one object .. 

     const [pokemonListState, setPokemonListState]=useState({
        pokemonlist:{},
       isloading: true,
       pokedexurl:'https://pokeapi.co/api/v2/pokemon',
       nextUrl:'',
       prevUrl:''

     });

        async function downloadpokemon(){
            //setIsLoading(true);

            setPokemonListState({...pokemonListState,isloading:true});

            const response= await axios.get(pokemonListState.pokedexurl);// download list of 20 pokemon 
            const pokemonresults=response.data.results;// we get the array of pokemon form result 

            console.log(response.data);
            // setnexturl(response.data.next);
            // setprevurl(response.data.previous);
            
            setPokemonListState((state)=>({
                         ...state,
                         nextUrl:response.data.next,
                        prevUrl:response.data.previous
                }));



            //iterating over the array of pokemon and using url , to create of array of pokemon 
            // that iwll download those 20 pokemon;
            const pokemoneResultpromise=pokemonresults.map((pokemon)=> axios.get(pokemon.url));
            // passing that porimiss array to axios.all 

            const pokemonData= await axios.all(pokemoneResultpromise);// array of 20 pokemon deatils data 

            console.log(pokemonData);
            // iterate on the date of each pokemon by the help of id,name type,and image ;

            const pokeListResult=pokemonData.map((pokeData)=>{
                const pokemon=pokeData.data;
                return {
                    id:pokemon.id,
                     name:pokemon.name,
                        image:(pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default:pokemon.sprite.front_shiny,
                        types:pokemon.types
                }
            });
            console.log(pokeListResult);
            setPokemonListState((state)=>({
                ...state,
                pokemonlist:pokeListResult,
                isloading:false
            }));
           
        }

    useEffect(()=>{
        downloadpokemon();
        
        },[pokemonListState.pokedexurl])


    return (
      <div className="pokemon-list-wrapper">
            
           <div className="Pokemon-wapper">
               {(pokemonListState.isloading) ? 'loading.......':
                  pokemonListState.pokemonlist.map((p)=> 
                    
                   <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>
                   
             ) } 
           </div>
          
          <div className="controls">
             <button disabled={pokemonListState.prevUrl== null} onClick={()=>{ 
              const urlToSet=pokemonListState.prevUrl;
                setPokemonListState({ ...pokemonListState,pokedexurl:urlToSet})}}
                >Prev</button>
             <button disabled={pokemonListState.nextUrl==null} onClick={()=> { 
                const urlToSet=pokemonListState.nextUrl;
                setPokemonListState({ ...pokemonListState,pokedexurl:urlToSet})}}
                >Next</button>
          </div>
      </div>
    )
}

export default PokemonList;