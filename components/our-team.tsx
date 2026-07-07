"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const teamMembers = [
  {
    name: "Kabasha Rutigunga Alphonse",
    title: "Managing Director",
    bio: "15+ years of experience in financial consulting and business strategy.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kabasha%20Rutigunga%20Alphonse-o4MX3A66b27nr5uQ1YkmXVzZWBKGcQ.jpg",
  },
  {
    name: "Bernard Nyakenywa Obiri",
    title: "Managing Partner",
    bio: "Certified Public Accountant with expertise in regulatory compliance and auditing.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bernard%20Nyakenywa%20Obiri-G989qDRF0d1ouumF9Ss5isjiTRoHvW.jpg",
  },
  {
    name: "Mutesi Cecily",
    title: "Audit Manager",
    bio: "Specialist in audit management and financial compliance.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mutesi%20Cecily-mrEa6qh96vP8OSDS26ozUsPQGtrrti.jpg",
  },
  {
    name: "Ringuyeneza Fidele",
    title: "Audit Manager",
    bio: "Expert in audit operations and compliance verification.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ringuyeneza%20Fidele-heY5pH7YEgnGFkot01AtVr8bOKbBkq.jpg",
  },
  {
    name: "Zaninka Magali",
    title: "Human Resource Manager",
    bio: "Experienced in human resource management and team development.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Zaninka%20Magali-2ZWkGKkHs14LEoxtZFVvD79iUeojzE.jpg",
  },
  {
    name: "Nasingizwe Elise",
    title: "Accountant",
    bio: "Skilled in accounting operations and financial record management.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nasingizwe%20Elise-ugUaCL6KR05ieVosV5SmRzZQM5rxF1.jpg",
  },
  {
    name: "Kampire Desange",
    title: "Auditor",
    bio: "Dedicated auditor with strong attention to detail and compliance expertise.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kampire%20Desange-kgYIQxeT4B230giNZIQDvNtp2eWyHK.jpg",
  },
  {
    name: "Immaculee Murekatete",
    title: "Accountant",
    bio: "Skilled accountant with expertise in financial record management and reporting.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/team%20rsk_Immaculee%20MUREKATETE%2C%20Accountant-YEdjNGtlcpGybgSFvjZvCkZRmaHLUt.jpg",
  },
  {
    name: "J. Leonard Dushimirwamana",
    title: "Auditor",
    bio: "Experienced auditor committed to thorough financial examination and verification.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/team%20rsk_J.%20Leonard%20DUSHIMI%CE%9C%CE%91%CE%9D%CE%91%2C%20Auditor-Lc1wydpEMTWWS6HxZpX3Gpe8E6C0i4.jpg",
  },
]

export function OurTeam() {
  return (
    <section id="our-team" className="relative py-20 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-6xl w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-4">
            Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the experienced professionals who deliver exceptional results for our clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.title}</p>
                {/* <p className="text-sm text-muted-foreground">{member.bio}</p> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
