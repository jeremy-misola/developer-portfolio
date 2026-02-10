"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const Education = () => {
    const t = useTranslations("Education");
    const locale = useLocale();

    const educationData = [
        {
            school: "Concordia University",
            location: locale === 'fr' ? "Montréal, QC" : "Montreal, QC",
            degree: locale === 'fr' ? "Baccalauréat en Informatique (À venir)" : "Bachelor of Computer Science (Incoming)",
            date: locale === 'fr' ? "Sept. 2026 -- Mai 2029" : "Sept. 2026 -- May 2029",
        },
        {
            school: "Champlain College Saint-Lambert",
            location: "Saint-Lambert, QC",
            degree: locale === 'fr' ? "Diplôme d'études collégiales (DEC) en Informatique" : "Diploma of College Studies (DEC) in Computer Science",
            date: locale === 'fr' ? "Août 2023 -- Juin 2026" : "Aug. 2023 -- June 2026",
        },
    ];

    return (
        <section id="education" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold tracking-tight mb-4">{t("title")}</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        {locale === 'fr' ? "Mon socle académique en informatique." : "My academic foundation in Computer Science."}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {educationData.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full border-border/60 bg-background/80 backdrop-blur hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <GraduationCap className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold">{edu.school}</CardTitle>
                                                <CardDescription className="flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {edu.location}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="font-semibold text-lg">{edu.degree}</h3>
                                            <Badge variant="outline" className="w-fit">
                                                <Calendar className="h-3 w-3 mr-2" />
                                                {edu.date}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
