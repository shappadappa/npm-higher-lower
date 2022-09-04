import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from "../styles/Home.module.css"

export default function Home() {
  // to be used later:

  // const [downloads, setDownloads] = useState(null)
  // const [module, setModule] = useState("")
  // const [error, setError] = useState(null)
  
  // setDownloads(null)
  // setError(null)

  // const res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${module}`)
  // const data = await res.json()

  // if(res.ok){
  //   setDownloads(data.downloads)
  // } else{
  //   setError(data.error)
  // }

  return (
    <div>
      <Head>
        <title>Higher or Lower</title>
        <meta name="keywords" content="npm game"></meta>
      </Head>

      <div className={styles.title}>
        <Image src="/npm-logo.png" width={100} height={100} alt="npm logo" />
        <h1>Higher or Lower</h1>
      </div>
      
      <p>This is a higher or lower game using npm&apos;s weekly downloads stats.</p>
      <Link href="/play"><a className={styles.link}>Play now</a></Link>
    </div>
  )
}
