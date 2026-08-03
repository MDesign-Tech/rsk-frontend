                                                                  "use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { LocationSection } from "@/components/location-section";
import { contactService } from "@/services/contact.service";
import { toast } from "sonner";
import { useWebsiteStore } from "@/stores/website.store";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

const CONTACT_ICONS = [Mail, Phone, MapPin];

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const about = useWebsiteStore((state) => state.data?.about);

  const contactMethods =
    about?.contactMethods?.filter((method) => method.visible !== false) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactService.create(formData);
      setIsSubmitting(false);
      toast.success("Message sent! We'll get back to you soon.");
      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setIsSubmitting(false);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.",
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMessageChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      message: html,
    }));
  };

  return (
     <div id="contact-us" className="flex h-full flex-col justify-between gap-18 overflow-x-hidden pt-40 md:gap-24 md:pt-45 lg:gap-35 lg:pt-47.5">
       <div className="">
         <motion.div
           className="text-center mb-10"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           viewport={{ once: true }}
         >
           <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-display mb-3">
             Get in Touch
           </h2>
           <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
             Have a question? We'd love to hear from you. Send us a message and
             we'll respond as soon as possible.
           </p>
         </motion.div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
             <div>
               <h3 className="text-lg sm:text-xl font-semibold mb-4">
                 Contact Information
               </h3>
               <div className="space-y-4">
                 {contactMethods.map((method, index) => {
                   const Icon = CONTACT_ICONS[index];

                   return (
                     <motion.div key={index} className="flex items-start gap-3">
                       <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />

                       <div>
                         <h4 className="font-semibold text-sm">{method.label}</h4>

                         {method.href ? (
                           <a href={method.href} target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                             {method.value}
                           </a>
                         ) : (
                           <p className="text-sm text-muted-foreground">{method.value}</p>
                         )}
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
             </div>
          </motion.div>

          {/* Contact Form */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
           >
             <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                 <label
                   htmlFor="name"
                   className="block text-sm font-medium mb-1.5"
                 >
                   Name
                 </label>
                 <input
                   type="text"
                   id="name"
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   required
                   disabled={isSubmitting}
                   className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-sm"
                   placeholder="Your name"
                 />
               </div>

               <div>
                 <label
                   htmlFor="email"
                   className="block text-sm font-medium mb-1.5"
                 >
                   Email
                 </label>
                 <input
                   type="email"
                   id="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   required
                   disabled={isSubmitting}
                   className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-sm"
                   placeholder="your.email@example.com"
                 />
               </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1.5"
                  >
                    Message
                  </label>
                  <RichTextEditor
                    value={formData.message}
                    onChange={handleMessageChange}
                    placeholder="Tell us about your project..."
                    disabled={isSubmitting}
                    showToolbar={false}
                    minHeight="120px"
                  />
                </div>

               <SubmitButton
                 type="submit"
                 className="w-full gap-2"
                 size="lg"
                 isLoading={isSubmitting}
               >
                 Send Message
                 <ArrowRight className="w-4 h-4" aria-hidden="true" />
               </SubmitButton>
             </form>
           </motion.div>
        </div>

        <LocationSection />
      </div>
    </div>
  );
}
