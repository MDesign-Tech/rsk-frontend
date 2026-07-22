"use client";

import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import type { Opportunity } from "@/types";
import { opportunityService } from "@/services/opportunity";
import { Calendar, MapPin, Briefcase, DollarSign, Mail, Phone, Building2, CheckCircle2 } from "lucide-react";

export default function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOpportunity = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await opportunityService.getBySlug(params.slug);
        setOpportunity(data);
      } catch (err) {
        console.error("Failed to load opportunity:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadOpportunity();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-64 w-full bg-muted rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-4/6 bg-muted rounded" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !opportunity) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={opportunity.image}
              alt={opportunity.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary text-white mb-3">
                {opportunity.type}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white">{opportunity.title}</h1>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{opportunity.organization.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {formatDate(opportunity.deadline)}</span>
            </div>
            {opportunity.employmentType && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{opportunity.employmentType}</span>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="mb-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {opportunity.shortDescription}
            </p>
          </div>

          {/* Full Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
              {opportunity.description}
            </div>
          </div>

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Benefits</h2>
              <ul className="space-y-2">
                {opportunity.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compensation Info */}
          {(opportunity.salary || opportunity.budget) && (
            <div className="mb-8 p-6 rounded-2xl border border-border/60 bg-card">
              <h2 className="text-xl font-semibold mb-4">Compensation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunity.salary && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary / Stipend</p>
                      <p className="font-medium">{opportunity.salary}</p>
                    </div>
                  </div>
                )}
                {opportunity.budget && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">{opportunity.budget}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-8 p-6 rounded-2xl border border-border/60 bg-card">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${opportunity.contact.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>{opportunity.contact.email}</span>
              </a>
              <a
                href={`tel:${opportunity.contact.phone}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>{opportunity.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Category & Status */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-muted text-muted-foreground">
              {opportunity.category}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                opportunity.status === "Open"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {opportunity.status}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
