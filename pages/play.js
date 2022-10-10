import Head from 'next/head'

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "../styles/Play.module.css"

const allPackages = ["lodash", "chalk", "request", "commander", "react", "express", "debug", "async", "fs-extra", "moment", "prop-types", "react-dom", "bluebird", "underscore", "vue", "axios", "tslib", "mkdirp", "glob", "yargs", "colors", "inquirer", "webpack", "uuid", "classnames", "minimist", "body-parser", "rxjs", "babel-runtime", "jquery", "yeoman-generator", "through2", "babel-core", "semver", "babel-loader", "cheerio", "rimraf", "q", "eslint", "css-loader", "shelljs", "dotenv", "typescript", "@types/node", "@angular/core", "js-yaml", "style-loader", "winston", "@angular/common", "redux"] // taken from npm rank
let availablePackages = [...allPackages]

const countUpTime = 1;
const slideAnimationTime = 0.8;

const Play = () => {
    const hiddenDownloadsCounter = useRef(null)

    const [playing, setPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [sliding, setSliding] = useState(false)
    const [hideDownloads, setHideDownloads] = useState(true)
    const [gameOver, setGameOver] = useState(false)
    const [correct, setCorrect] = useState(false)
    const [highScore, setHighScore]= useState(null)

    const [packages, setPackages] = useState([])
    const [weeklyDownloads, setWeeklyDownloads] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>{
        const fetchWeeklyDownloads = async() =>{
            setIsLoading(true)
            let tempWeeklyDownloads = []

            let res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packages [0]}`)
            let data = await res.json()
    
            if(res.ok){
                tempWeeklyDownloads.push(data.downloads)
            }
    
            res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packages [1]}`)
            data = await res.json()
    
            if(res.ok){
                tempWeeklyDownloads.push(data.downloads)
            }
    
            res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${packages [2]}`)
            data = await res.json()
    
            if(res.ok){
                tempWeeklyDownloads.push(data.downloads)
            }

            setWeeklyDownloads(tempWeeklyDownloads)
            setIsLoading(false)
        }

        if(packages [0] && packages [1] && packages [2]){
            fetchWeeklyDownloads()
        }
    }, [packages])

    useEffect(() =>{
        setIsLoading(true)
        generateRandomPackages()

        if(typeof window !== "undefined"){
            setHighScore(localStorage.getItem("highScore"))
        }
    }, [])

    const generateRandomPackages = () => {
        const randomPackage1 = availablePackages [Math.floor(Math.random () * availablePackages.length)];
        availablePackages.splice(availablePackages.indexOf(randomPackage1), 1)

        const randomPackage2 = availablePackages [Math.floor(Math.random () * availablePackages.length)];
        availablePackages.splice(availablePackages.indexOf(randomPackage2), 1)

        const randomPackage3 = availablePackages [Math.floor(Math.random () * availablePackages.length)];
        availablePackages.splice(availablePackages.indexOf(randomPackage3), 1)
        
        setPackages([randomPackage1, randomPackage2, randomPackage3])
    }

    const resetGame = () =>{
        generateRandomPackages()
        setScore(0)
        setSliding(false)
        availablePackages = [...allPackages]
        setCorrect(false)
        setIsLoading(false)
        setHideDownloads(true)
        setGameOver(false)
    }    

    const handleClick = (mode, npmPackage) =>{
        const packageIndex = packages.indexOf(npmPackage)

        if(mode === "higher" && weeklyDownloads [packageIndex] > weeklyDownloads [packageIndex - 1] ||
        mode === "lower" && weeklyDownloads [packageIndex] < weeklyDownloads [packageIndex - 1] ||
        weeklyDownloads [packageIndex] === weeklyDownloads [packageIndex - 1]){
            setCorrect(true)
            setSliding(true)
            const newPackage = availablePackages [Math.floor(Math.random() * availablePackages.length)]
            availablePackages.splice(availablePackages.indexOf(newPackage), 1)
            
            setTimeout(() =>{
                setSliding(false)
                setPackages([packages [1], packages [2], newPackage])
                setCorrect(false)
                setHideDownloads(true)
                setIsLoading(false)
                setScore(score + 1)
            }, (countUpTime + slideAnimationTime) * 1000)
        }
        else{
            setTimeout(() => {
                setGameOver(true)
                setIsLoading(false)
                if(score > highScore){
                    localStorage.setItem("highScore", score)
                    setHighScore(score)
                }
            }, countUpTime * 1000 + 500);
        }

        setHideDownloads(false)
        setIsLoading(true)
    }

    return (
        <div>
            <Head>
                <title>Higher or Lower - Play Game</title>
                <meta name="keywords" content="npm game"></meta>
                <link rel="icon" href="/images/favicon.ico" />
            </Head>

            {highScore && <div className={styles ["high-score"]}>Your high score: {highScore}</div>}

            {isLoading ? 
                <div className={styles.loader}></div>
            : 
                <button disabled={isLoading} className={styles.button} onClick={() => setPlaying(true)}>Start Game</button>
            }

            {playing && 
                <div className={styles["game-container"]}>
                    <div className={styles.game}>
                        <button disabled={sliding} title="Close game" className={styles.close} onClick={() => {
                            setPlaying(false)
                            resetGame()
                        }}>x</button>

                        {!gameOver ? 
                            <>
                                <span className={styles.score}>Your score: {score}</span>
                                {packages.map((npmPackage, index) =>(
                                    <div key={index} className={`${styles.panel}${packages [2] === npmPackage ? " " + styles.hidden + " " : ""}${sliding ? " " + styles.sliding : ""}`}>
                                        <span className={styles.name}>{npmPackage}</span>

                                        {npmPackage === packages [1] && !hideDownloads &&
                                            <CountUp separator="," duration={1} end={weeklyDownloads [index]} prefix="Has " suffix=" weekly downloads" className={styles.details}></CountUp>
                                        }{npmPackage === packages [0] &&
                                            <span className={styles.details}>Has {weeklyDownloads [index].toLocaleString()} weekly downloads</span>
                                        }{((npmPackage === packages [1] && hideDownloads) || npmPackage === packages [2]) &&
                                            <span className={styles.details}>Has <span ref={hiddenDownloadsCounter}>???</span> weekly downloads</span>
                                        }

                                        {npmPackage !== packages [0] &&
                                            <div className={styles["buttons-container"]}>
                                                <button disabled={isLoading} onClick={() =>{handleClick("higher", npmPackage)}} className={styles["higher-button"]}>Higher</button>
                                                <button disabled={isLoading} onClick={() =>{handleClick("lower", npmPackage)}} className={styles["lower-button"]}>Lower</button>
                                            </div>
                                        }
                                    </div>
                                ))}
                                <div className={styles.versus}>vs</div>
                            </>
                            :
                            <div className={styles ["game-over"]}>
                                <div>
                                    Game over <br />You finished with a score of {score}
                                </div>
                                <button disabled={isLoading} className={styles ["play-again"]} onClick={() => resetGame()}>Play Again</button>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}
 
export default Play;