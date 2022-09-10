import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "../styles/Play.module.css"

const allPackages = ["lodash", "chalk", "request", "commander", "react", "express", "debug", "async", "fs-extra", "moment", "prop-types", "react-dom", "bluebird", "underscore", "vue", "axios", "tslib", "mkdirp", "glob", "yargs", "colors", "inquirer", "webpack", "uuid", "classnames", "minimist", "body-parser", "rxjs", "babel-runtime", "jquery", "yeoman-generator", "through2", "babel-core", "semver", "babel-loader", "cheerio", "rimraf", "q", "eslint", "css-loader", "shelljs", "dotenv", "typescript", "@types/node", "@angular/core", "js-yaml", "style-loader", "winston", "@angular/common", "redux"] // taken from npm rank
let availablePackages = [...allPackages]

const Play = () => {
    const hiddenDownloadsCounter = useRef(null)

    const [playing, setPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [sliding, setSliding] = useState(false)
    const [hideDownloads, setHideDownloads] = useState(true)
    const [hideButtons, setHideButtons] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [correct, setCorrect] = useState(false)

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

            console.log(tempWeeklyDownloads)

            setWeeklyDownloads(tempWeeklyDownloads)
            setIsLoading(false)
        }

        if(packages [0] && packages [1] && packages [2]){
            console.log(packages)
            fetchWeeklyDownloads()
        }
    }, [packages])

    useEffect(() =>{
        setIsLoading(true)
        generateRandomPackages()
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
        availablePackages = [...packages]
        setCorrect(false)
        setHideButtons(false)
        setHideDownloads(true)
        setGameOver(false)
    }    

    const handleClick = (mode, npmPackage) =>{
        const packageIndex = packages.indexOf(npmPackage)

        if(mode === "higher" && weeklyDownloads [packageIndex] > weeklyDownloads [packageIndex - 1]){
            setTimeout(() =>{
                setScore(score + 1)
            }, 1000)

            setCorrect(true)
            const newPackage = availablePackages [Math.floor(Math.random() * availablePackages.length)]
            availablePackages.splice(availablePackages.indexOf(newPackage), 1)
            
            setTimeout(() =>{
                setPackages([packages [1], packages [2], newPackage])
                setCorrect(false)
                setHideDownloads(true)
                setHideButtons(false)
            }, 1800)
        } else if(mode === "lower" && weeklyDownloads [packageIndex] < weeklyDownloads [packageIndex - 1]){
            setTimeout(() =>{
                setScore(score + 1)
            }, 1000)

            setCorrect(true)
            const newPackage = availablePackages [Math.floor(Math.random() * availablePackages.length)]
            availablePackages.splice(availablePackages.indexOf(newPackage), 1)
            
            setTimeout(() =>{
                setPackages([packages [1], packages [2], newPackage])
                setCorrect(false)
                setHideDownloads(true)
                setHideButtons(false)
            }, 1800)
        } else{
            setTimeout(() => {
                setGameOver(true)
            }, 1500);
        }

        setHideDownloads(false)
        setHideButtons(true)
    }

    return (
        <div>
            {isLoading ? 
                <div className={styles.loader}></div>
            : 
                <button disabled={isLoading} className={styles.button} onClick={() => setPlaying(true)}>Start Game</button>
            }

            {playing && 
                <div className={styles["game-container"]}>
                    <div className={styles.game}>
                        <button title="Close game" className={styles.close} onClick={() => {
                            setPlaying(false)
                            resetGame()
                        }}>x</button>

                        {!gameOver ? 
                            <>
                                <span className={styles.score}>Your score: {score}</span>
                                {packages.map((npmPackage, index) =>(
                                    <div key={index} className={`${styles.panel} ${!sliding && packages [2] === npmPackage ? styles.hidden : ""}`}>
                                        <span className={styles.name}>{npmPackage}</span>
                                        
                                        {npmPackage === packages [1] && !hideDownloads &&
                                            <CountUp separator="," duration={1} end={weeklyDownloads [index]} prefix="Has " suffix=" weekly downloads" className={styles.details}></CountUp>
                                        }{npmPackage === packages [0] &&
                                            <span className={styles.details}>Has {weeklyDownloads [index].toLocaleString()} downloads</span>
                                        }{npmPackage === packages [1] && hideDownloads &&
                                            <span className={styles.details}>Has <span ref={hiddenDownloadsCounter}>???</span> weekly downloads</span>
                                        }

                                        {npmPackage !== packages [0] && !hideButtons &&
                                            <div className={styles["buttons-container"]}>
                                                <button onClick={() =>{handleClick("higher", npmPackage)}} className={styles["higher-button"]}>Higher</button>
                                                <button onClick={() =>{handleClick("lower", npmPackage)}} className={styles["lower-button"]}>Lower</button>
                                            </div>
                                        }
                                        {npmPackage === packages [1] && correct && 
                                            <div className={styles.tick}>✔️</div>
                                        }
                                    </div>
                                ))}
                            </>
                            :
                            <div className={styles ["game-over"]}>
                                Game over
                                <br />You finished with a score of {score}
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}
 
export default Play;