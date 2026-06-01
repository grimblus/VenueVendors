import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import FooterContainer from "@/components/footer";
import HeaderContainer from "@/components/header";
import { useRouter } from "next/router";
import { Text } from "@chakra-ui/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  //TODO: NEED TO ADD INFORMATION - "The landing page should display information about the 
  //      VV web system and a navigation bar with appropriate links"
  return (
    <div className="mainpage min-h-screen flex flex-col">
      <HeaderContainer/>
        <div className="mainContent flex flex-1 flex-col items-left justify-center">
          <Text textStyle="7xl" fontWeight="bold">Welcome to Venue Vendors</Text>
          <Text textStyle="xl">
            Venue Vendors is a company is a web system designed to
            help you find your perfect venue to make your special events even more special. 
            Use our website to find the venue you need quick and seamlessly
          </Text>
          {/* <button onClick={() => router.push("/hirers")}>click me to go to hirers page</button>
          <p></p>
          <button onClick={() => router.push("/vendors")}>click me to go to vendors page</button> */}
        </div> 
      <FooterContainer/>
    </div>
  );
}
