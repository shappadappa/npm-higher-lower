import Link from "next/link";

const Navbar = () => {
    return (
        <nav>
            <Link href="/"><a>Home</a></Link>
            <Link href="/play"><a>Play</a></Link>
        </nav>
    );
}
 
export default Navbar;