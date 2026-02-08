"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // First try to fetch from admin API (for authenticated users)
        const response = await fetch("/api/admin/testimonials");
        
        if (response.ok) {
          const data = await response.json();
          // Filter for approved testimonials only
          const approvedTestimonials = Array.isArray(data) ? data.filter(t => t.status === "approved") : [];
          setTestimonials(approvedTestimonials);
        } else if (response.status === 401) {
          // Authentication failed, try fallback method
          await fetchTestimonialsFallback();
        } else {
          throw new Error(`Failed to fetch testimonials: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // Try fallback method if primary method fails
        await fetchTestimonialsFallback();
      }
    };

    const fetchTestimonialsFallback = async () => {
      try {
        // Fallback: fetch approved testimonials directly from public API or static data
        const response = await fetch("/api/testimonials");
        
        if (response.ok) {
          const data = await response.json();
          setTestimonials(Array.isArray(data) ? data : []);
        } else {
          throw new Error("Fallback API also failed");
        }
      } catch (fallbackError) {
        console.error("Fallback method failed:", fallbackError);
        setError("Unable to load testimonials at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const scrollReveal = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (loading) {
    return (
      <section id="testimonials" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight">Client Testimonials</h2>
            <p className="mt-4 text-xl text-muted-foreground">Loading testimonials...</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight">Client Testimonials</h2>
            <p className="mt-4 text-xl text-muted-foreground">No testimonials available at this time.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="testimonials"
      className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={scrollReveal}
        >
          <h2 className="text-4xl font-bold tracking-tight">Client Testimonials</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            What clients say about working with me
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`} 
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${
                            starIndex < testimonial.rating 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-lg italic text-muted-foreground leading-relaxed mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <Badge variant="secondary" className="text-sm">
                    {testimonial.company}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Testimonials;