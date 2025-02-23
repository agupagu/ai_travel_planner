import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export function SponsorBanner() {
  return (
    <div className="w-full py-8">
      <Card className="overflow-hidden">
        <Link
          href="https://www.amazon.sg/s?k=travel+essentials&crid=EMRNWGVTC86U&sprefix=travel+esse%2Caps%2C253&ref=nb_sb_ss_ts-doa-p_1_11"
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative"
        >
          <div className="aspect-[21/9] relative overflow-hidden">
            <Image
              src="/adbanner.png?height=1080&width=1080"
              alt="Sponsor Banner"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          </div>
          <div className="absolute top-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">Sponsored</div>
        </Link>
      </Card>
    </div>
  )
}

