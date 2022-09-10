import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Higher or Lower</title>
        <meta name="keywords" content="npm game"></meta>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>

      <div className={styles.title}>
        <Image src="/images/npm-logo.png" width={100} height={100} alt="npm logo" />
        <h1>Higher or Lower</h1>
      </div>
      
      <p>A higher or lower game using npm&apos;s weekly downloads stats</p>
      <Link href="/play"><a className={styles.link}>Play now</a></Link>
    </div>
  )
}
