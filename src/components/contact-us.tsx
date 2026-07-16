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

const CONTACT_ICONS = [Mail, Phone, MapPin];

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const about = useWebsiteStore((state) => state.data?.about);

  const contactMethods = about?.contactMethods ?? [];

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section id="contact-us" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const Icon = CONTACT_ICONS[index];

                  return (
                    <motion.div key={index} className="flex items-start gap-4">
                      <Icon className="w-6 h-6 text-primary mt-1" />

                      <div>
                        <h4 className="font-semibold">{method.label}</h4>

                        {method.href ? (
                          <a href={method.href} target="_blank">
                            {method.value}
                          </a>
                        ) : (
                          <p>{method.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p className="text-muted-foreground mb-1">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
              <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                  placeholder="Tell us about your project..."
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
    </section>
  );
}
